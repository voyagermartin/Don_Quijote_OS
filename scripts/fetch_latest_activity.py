#!/usr/bin/env python3
"""
Garmin Connect 最新活動抓取與對照測試腳本
1. 讀取 .garmin_tokens 中的憑證登入 Garmin Client
2. 抓取帳號中最新一筆活動 (Latest Activity)
3. 於終端機精美格式化輸出 Don Quijote OS 關注之遙測指標
4. 將完整原始 JSON 儲存至 scripts/latest_activity_sample.json
"""

import json
import os
import sys
from garminconnect import Garmin

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

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    token_dir = os.path.join(os.getcwd(), ".garmin_tokens")
    if not os.path.exists(token_dir):
        print(f"❌ 找不到權杖目錄 {token_dir}，請先執行 `python scripts/get_garmin_token.py` 取得通行證。")
        sys.exit(1)

    print("🔐 正在讀取本地通行證登入 Garmin Connect...")
    try:
        garmin = Garmin()
        garmin.login(tokenstore=token_dir)
        print("✅ 登入成功！正在抓取最新一筆活動資料...\n")
    except Exception as e:
        print(f"❌ 登入失敗: {e}")
        sys.exit(1)

    # 抓取最新活動
    try:
        activities = garmin.get_activities(0, 1)
        if not activities:
            print("⚠️ 未找到任何活動紀錄。")
            sys.exit(0)
            
        activity = activities[0]
        activity_id = activity.get("activityId")

        # 嘗試取得更詳細的內層 JSON 數據 (若有)
        details = {}
        try:
            details = garmin.get_activity(activity_id)
        except Exception:
            pass

    except Exception as e:
        print(f"❌ 抓取活動時發生錯誤: {e}")
        sys.exit(1)

    # 提取關鍵欄位
    name = activity.get("activityName", "未命名活動")
    type_info = activity.get("activityType", {})
    type_key = type_info.get("typeKey", "unknown") if isinstance(type_info, dict) else str(type_info)
    start_time = activity.get("startTimeLocal", "N/A")
    
    dist_m = activity.get("distance", 0.0) or 0.0
    dist_km = dist_m / 1000.0
    
    dur_s = activity.get("duration", 0.0) or 0.0
    elapsed_s = activity.get("elapsedDuration", 0.0) or dur_s
    moving_s = activity.get("movingDuration", 0.0) or dur_s
    
    avg_speed = activity.get("averageSpeed", 0.0) or 0.0
    pace_str = calculate_pace(dist_m, moving_s if moving_s > 0 else dur_s, avg_speed)
    
    avg_hr = activity.get("averageHR")
    max_hr = activity.get("maxHR")
    
    cadence = activity.get("averageRunningCadenceInStepsPerMinute") or activity.get("averageCadence")
    elev_gain = activity.get("elevationGain")
    elev_loss = activity.get("elevationLoss")
    
    vert_osc = activity.get("avgVerticalOscillation")
    gct = activity.get("avgGroundContactTime")

    # 心率區間占比計算 (秒數)
    z1 = activity.get("hrTimeInZone_1", 0.0) or 0.0
    z2 = activity.get("hrTimeInZone_2", 0.0) or 0.0
    z3 = activity.get("hrTimeInZone_3", 0.0) or 0.0
    z4 = activity.get("hrTimeInZone_4", 0.0) or 0.0
    z5 = activity.get("hrTimeInZone_5", 0.0) or 0.0
    total_z_time = z1 + z2 + z3 + z4 + z5

    # 格式化輸出
    print("==================================================")
    print(f"🏃‍♂️ Garmin 最新活動對照戰報 [ID: {activity_id}]")
    print("==================================================")
    print(f"📌 活動名稱：{name}")
    print(f"🏷️ 活動類型：{type_key}")
    print(f"📅 開始時間：{start_time}")
    print(f"📏 總距離　：{dist_km:.2f} km")
    print(f"⏱️ 總時間　：{format_duration(dur_s)} (總經過: {format_duration(elapsed_s)} / 移動: {format_duration(moving_s)})")
    print(f"⚡ 平均配速：{pace_str}")
    print(f"❤️ 心率數據：平均 {int(round(avg_hr)) if avg_hr else 'N/A'} bpm | 最高 {int(round(max_hr)) if max_hr else 'N/A'} bpm")
    print(f"🦶 平均步頻：{f'{cadence:.1f} spm' if cadence else 'N/A'}")
    print(f"⛰️ 爬升/下降：↑ {int(round(elev_gain)) if elev_gain is not None else 'N/A'} m | ↓ {int(round(elev_loss)) if elev_loss is not None else 'N/A'} m")

    if total_z_time > 0:
        print("📊 心率區間 (HR Zones 占比):")
        print(f"   - Z1 (暖身/恢復): {z1/total_z_time*100:5.1f}% ({format_duration(z1)})")
        print(f"   - Z2 (燃脂/有氧): {z2/total_z_time*100:5.1f}% ({format_duration(z2)})")
        print(f"   - Z3 (馬拉松/有氧): {z3/total_z_time*100:5.1f}% ({format_duration(z3)})")
        print(f"   - Z4 (無氧/門檻): {z4/total_z_time*100:5.1f}% ({format_duration(z4)})")
        print(f"   - Z5 (極限/衝刺): {z5/total_z_time*100:5.1f}% ({format_duration(z5)})")
    else:
        print("📊 心率區間：無區間時間數據")

    print("🏃 跑姿力學遙測：")
    print(f"   - 垂直振幅 (Vertical Oscillation): {f'{vert_osc:.2f} cm' if vert_osc else 'N/A'}")
    print(f"   - 觸地時間 (Ground Contact Time): {f'{gct:.1f} ms' if gct else 'N/A'}")
    print("==================================================")

    # 寫出原始 JSON 樣例檔
    sample_path = os.path.join(os.getcwd(), "scripts", "latest_activity_sample.json")
    os.makedirs(os.path.dirname(sample_path), exist_ok=True)
    
    combined_sample = {
        "summary": activity,
        "details": details
    }
    
    with open(sample_path, "w", encoding="utf-8") as f:
        json.dump(combined_sample, f, indent=2, ensure_ascii=False)
        
    print(f"\n💾 原始 JSON 樣例已成功寫入: {sample_path}")

if __name__ == "__main__":
    main()
