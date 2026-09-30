#!/usr/bin/env python3
"""
Garmin Connect 本機授權驗證腳本
用於登入 Garmin 帳號並取得 OAuth tokens 儲存至本地 .garmin_tokens/ 目錄。
"""

import getpass
import os
import sys
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectTooManyRequestsError,
)

def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    print("==========================================")
    print("🛡️ Don Quijote OS - Garmin 授權環境設定")
    print("==========================================")
    
    email = input("請輸入 Garmin 帳號 (Email): ").strip()
    if not email:
        print("❌ 帳號不可為空白！")
        sys.exit(1)
        
    password = getpass.getpass("請輸入 Garmin 密碼: ").strip()
    if not password:
        print("❌ 密碼不可為空白！")
        sys.exit(1)

    # 設定權杖儲存目錄 (.garmin_tokens)
    token_dir = os.path.join(os.getcwd(), ".garmin_tokens")
    os.makedirs(token_dir, exist_ok=True)

    print("\n🔐 正在向 Garmin Connect 進行驗證，請稍候...")

    try:
        # 使用 garminconnect 登入並自動寫入 tokenstore
        garmin = Garmin(email=email, password=password)
        garmin.login(tokenstore=token_dir)
        
        # 確保 token 被 dump 到本地目錄
        if hasattr(garmin, "client") and hasattr(garmin.client, "dump"):
            garmin.client.dump(token_dir)

        print("\n🎉 Garmin 通行證取得成功！已安全儲存於本地。")
        print(f"📁 權杖目錄: {token_dir}")

    except GarminConnectAuthenticationError as e:
        print(f"\n❌ 驗證失敗：帳號或密碼錯誤。({e})")
        sys.exit(1)
    except GarminConnectTooManyRequestsError as e:
        print(f"\n❌ 請求過於頻繁 (429)：請稍後再試。({e})")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 登入過程發生錯誤: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
