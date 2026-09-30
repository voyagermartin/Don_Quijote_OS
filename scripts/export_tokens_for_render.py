#!/usr/bin/env python3
"""
Garmin 通行證 Base64 導出腳本 (用於 Render 雲端部署)
讀取本機 .garmin_tokens/ 資料夾，打包並轉碼為 Base64 字串
將結果寫入 token_render_clean.txt，以便複製貼至 Render 環境變數 GARMIN_TOKENS_BASE64。
"""

import base64
import io
import os
import sys
import zipfile

def export_tokens():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    token_dir = os.path.join(os.getcwd(), ".garmin_tokens")
    if not os.path.exists(token_dir) or not os.listdir(token_dir):
        print(f"❌ 找不到權杖目錄 {token_dir} 或內容空白！")
        print("💡 請先於本機執行 `python scripts/get_garmin_token.py` 完成 Garmin 登入。")
        sys.exit(1)

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(token_dir):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, token_dir)
                zf.write(abs_path, rel_path)

    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8").strip()

    # 寫入單行乾淨的 UTF-8 檔案
    output_file = os.path.join(os.getcwd(), "token_render_clean.txt")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(b64_str)

    print("==================================================")
    print("🔑 Garmin 本機通行證 Base64 金鑰已成功匯出！")
    print(f"📄 已儲存至乾淨文字檔: {output_file}")
    print("==================================================")
    print("📋 請複製下方這一大串完整 Base64 字串：\n")
    print(b64_str)
    print("\n==================================================")
    print("⚙️ Render 後台設定說明：")
    print("1. 前往 Render Dashboard -> 選擇您的 Web Service (don-quijote-os)")
    print("2. 進入 Environment 頁籤 -> Add Environment Variable")
    print("3. Key 輸入:   GARMIN_TOKENS_BASE64")
    print("4. Value 貼上: (即上方字串或 token_render_clean.txt 的內容)")
    print("5. 儲存設定，雲端服務即刻啟用！")
    print("==================================================")

if __name__ == "__main__":
    export_tokens()
