#!/usr/bin/env python3
"""
Garmin Connect API 微服務 (Don Quijote OS)
提供 http://0.0.0.0:PORT/api/garmin/latest 端點
支援 Render / 雲端平台環境變數 GARMIN_TOKENS_BASE64 免密自動驗證
"""

import base64
import io
import json
import os
import sys
import zipfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from garminconnect import Garmin

PORT = int(os.environ.get("PORT", 8000))

def setup_tokens_from_env():
    tokens_b64 = os.environ.get("GARMIN_TOKENS_BASE64")
    if not tokens_b64:
        return False, "環境變數 GARMIN_TOKENS_BASE64 未設定，請至 Render Dashboard -> Environment 新增。"

    try:
        token_dir = os.path.join(os.getcwd(), ".garmin_tokens")
        os.makedirs(token_dir, exist_ok=True)

        # 1. 徹底去除所有空白、換行與單雙引號
        raw_token = tokens_b64.strip().replace("\r", "").replace("\n", "").replace(" ", "").strip('"').strip("'")
        
        # 2. 自動補齊 Base64 padding (4 的倍數)
        missing_padding = len(raw_token) % 4
        if missing_padding:
            raw_token += '=' * (4 - missing_padding)

        zip_bytes = base64.b64decode(raw_token)
        buffer = io.BytesIO(zip_bytes)
        with zipfile.ZipFile(buffer, "r") as zf:
            zf.extractall(token_dir)
        print("🔑 成功從 GARMIN_TOKENS_BASE64 環境變數載入並解碼通行證！")
        return True, "OK"
    except Exception as e:
        return False, f"GARMIN_TOKENS_BASE64 解碼/解壓失敗: {e}"

def format_duration(seconds):
    if not seconds:
        return "00:00:00"
    total_sec = int(round(seconds))
    hours = total_sec // 3600
    minutes = (total_sec % 3600) // 60
    secs = total_sec % 60
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"

def calculate_pace(distance_m, duration_s, speed_mps=None):
    if distance_m and distance_m > 0 and duration_s and duration_s > 0:
        sec_per_km = duration_s / (distance_m / 1000.0)
    elif speed_mps and speed_mps > 0:
        sec_per_km = 1000.0 / speed_mps
    else:
        return "N/A"
    
    mins = int(sec_per_km // 60)
    secs = int(sec_per_km % 60)
    return f"{mins}'{secs:02d}\"/km"

def fetch_garmin_latest():
    success, env_msg = setup_tokens_from_env()

    token_dir = os.path.join(os.getcwd(), ".garmin_tokens")
    if not os.path.exists(token_dir) or not os.listdir(token_dir):
        raise Exception(f"通行證權杖目錄未就緒 ({env_msg})。請在 Render 環境變數設定 GARMIN_TOKENS_BASE64。")

    garmin = Garmin()
    garmin.login(tokenstore=token_dir)
    
    activities = garmin.get_activities(0, 1)
    if not activities:
        raise Exception("未找到任何 Garmin 活動紀錄。")
        
    act = activities[0]
    
    # 解析日期與時間
    start_time_str = act.get("startTimeLocal", "")
    date_part = ""
    time_part = ""
    if " " in start_time_str:
        date_part, time_part = start_time_str.split(" ", 1)
    elif "T" in start_time_str:
        date_part, time_part = start_time_str.split("T", 1)
    else:
        date_part = start_time_str

    type_info = act.get("activityType", {})
    type_key = type_info.get("typeKey", "running") if isinstance(type_info, dict) else str(type_info)
    
    dist_m = act.get("distance", 0.0) or 0.0
    dist_km = round(dist_m / 1000.0, 2)
    
    dur_s = act.get("duration", 0.0) or 0.0
    moving_s = act.get("movingDuration", 0.0) or dur_s
    elapsed_s = act.get("elapsedDuration", 0.0) or dur_s
    
    avg_speed = act.get("averageSpeed", 0.0) or 0.0
    pace_str = calculate_pace(dist_m, moving_s if moving_s > 0 else dur_s, avg_speed)

    # 計算跑段配速 (Interval / Split Pace)
    interval_pace = None
    splits = act.get("splitSummaries", [])
    for s in splits:
        stype = s.get("splitType", "")
        if stype in ["INTERVAL_ACTIVE", "RWD_RUN"]:
            spd = s.get("averageSpeed")
            if spd and spd > 0:
                interval_pace = calculate_pace(s.get("distance"), s.get("duration"), spd)
                break

    if not interval_pace and act.get("fastestSplit_1000"):
        interval_pace = calculate_pace(1000, act.get("fastestSplit_1000"))

    # 天氣與氣溫
    min_temp = act.get("minTemperature")
    max_temp = act.get("maxTemperature")
    weather_str = None
    if min_temp is not None and max_temp is not None:
        avg_temp = int(round((min_temp + max_temp) / 2.0))
        weather_str = f"{avg_temp}°C"
    elif max_temp is not None:
        weather_str = f"{int(round(max_temp))}°C"

    # 地點
    location = act.get("locationName") or act.get("activityName")

    # VO2Max
    vo2_max = int(round(act.get("vO2MaxValue"))) if act.get("vO2MaxValue") else None

    # 心率與步頻
    avg_hr = act.get("averageHR")
    max_hr = act.get("maxHR")
    cadence = act.get("averageRunningCadenceInStepsPerMinute") or act.get("averageCadence")
    max_cadence = act.get("maxRunningCadenceInStepsPerMinute") or act.get("maxDoubleCadence")

    # 爬升/下降
    elev_gain = act.get("elevationGain")
    elev_loss = act.get("elevationLoss")
    
    # 跑姿力學
    vert_osc = act.get("avgVerticalOscillation")
    gct = act.get("avgGroundContactTime")
    movement_efficiency = act.get("avgVerticalRatio")

    # 心率區間占比 (%)
    z1 = act.get("hrTimeInZone_1", 0.0) or 0.0
    z2 = act.get("hrTimeInZone_2", 0.0) or 0.0
    z3 = act.get("hrTimeInZone_3", 0.0) or 0.0
    z4 = act.get("hrTimeInZone_4", 0.0) or 0.0
    z5 = act.get("hrTimeInZone_5", 0.0) or 0.0
    total_z_time = z1 + z2 + z3 + z4 + z5
    
    hr_zones = {
        "z1": round((z1 / total_z_time) * 100, 1) if total_z_time > 0 else 0.0,
        "z2": round((z2 / total_z_time) * 100, 1) if total_z_time > 0 else 0.0,
        "z3": round((z3 / total_z_time) * 100, 1) if total_z_time > 0 else 0.0,
        "z4": round((z4 / total_z_time) * 100, 1) if total_z_time > 0 else 0.0,
        "z5": round((z5 / total_z_time) * 100, 1) if total_z_time > 0 else 0.0,
    }

    # 抓取活動關聯的 Garmin 裝備 (Gear) 與自訂暱稱 (Nickname)
    gear_items = []
    act_id = act.get("activityId")
    if act_id:
        try:
            gears_res = garmin.get_activity_gear(act_id)
            if isinstance(gears_res, list):
                items = gears_res
            elif isinstance(gears_res, dict):
                items = gears_res.get("gearItems", gears_res.get("gears", [gears_res]))
            else:
                items = []

            for item in items:
                if isinstance(item, dict):
                    custom_model = (
                        item.get("customMakeModel") or
                        item.get("name") or
                        item.get("modelName") or
                        item.get("gearModelName")
                    )
                    nickname = item.get("displayName")
                    gear_type = item.get("gearTypeName")

                    if custom_model:
                        custom_model = str(custom_model).strip()
                    if nickname:
                        nickname = str(nickname).strip()

                    if nickname and custom_model and nickname != custom_model:
                        full_label = f"「{nickname}」 {custom_model}"
                    else:
                        full_label = nickname or custom_model or "未命名裝備"

                    gear_items.append({
                        "name": custom_model or full_label,
                        "nickname": nickname if (nickname and nickname != custom_model) else None,
                        "displayName": full_label,
                        "gearType": gear_type
                    })
        except Exception as e:
            print(f"⚠️ 抓取 Garmin 裝備時發生非致命錯誤: {e}")

    return {
        "activityId": act.get("activityId"),
        "activityName": act.get("activityName", ""),
        "activityType": type_key,
        "gear": gear_items,
        "location": location,
        "weather": weather_str,
        "vo2Max": vo2_max,
        "date": date_part,
        "startTime": time_part,
        "distanceKm": dist_km,
        "durationFormatted": format_duration(dur_s),
        "movingDurationFormatted": format_duration(moving_s),
        "durationSeconds": dur_s,
        "movingDurationSeconds": moving_s,
        "avgPace": pace_str,
        "intervalPace": interval_pace,
        "avgHr": int(round(avg_hr)) if avg_hr else None,
        "maxHr": int(round(max_hr)) if max_hr else None,
        "avgCadence": round(cadence, 1) if cadence else None,
        "maxCadence": int(round(max_cadence)) if max_cadence else None,
        "elevationGain": int(round(elev_gain)) if elev_gain is not None else None,
        "elevationLoss": int(round(elev_loss)) if elev_loss is not None else None,
        "hrZones": hr_zones,
        "mechanics": {
            "movementEfficiency": round(movement_efficiency, 1) if movement_efficiency else None,
            "verticalOscillation": round(vert_osc, 2) if vert_osc else None,
            "groundContactTime": round(gct, 1) if gct else None
        }
    }

class GarminAPIRequestHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/garmin/latest":
            try:
                data = fetch_garmin_latest()
                response = {
                    "status": "success",
                    "data": data
                }
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                response = {
                    "status": "error",
                    "message": str(e)
                }
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode("utf-8"))
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": "Not Found"}, ensure_ascii=False).encode("utf-8"))

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    setup_tokens_from_env()

    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, GarminAPIRequestHandler)
    print("==========================================")
    print(f"🛡️ Garmin API 微服務已啟動 [0.0.0.0:{PORT}]")
    print(f"📡 API 端點: /api/garmin/latest")
    print("==========================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 伺服器已停止。")
        httpd.server_close()

if __name__ == "__main__":
    main()
