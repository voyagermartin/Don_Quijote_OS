# 📜 CHANGELOG (遠征開發日誌)

## [0.1.1] - 2026-07-25
### Changed
- 更新 [HANDBOOK.md](file:///f:/Projects/Don_Quijote_OS/HANDBOOK.md) 至 v0.1.1（明確三方協作家法、MVP 範圍與嚴格開發規範）。
- 成功透過 clasp 初始化 Google Apps Script (GAS) 專案 `DON_QUIJOTE_OS_GAS` 並建立 [.clasp.json](file:///f:/Projects/Don_Quijote_OS/.clasp.json) 與 [appsscript.json](file:///f:/Projects/Don_Quijote_OS/appsscript.json)。

### Added (Task 0.2)
- 新增 [gas_setup.js](file:///f:/Projects/Don_Quijote_OS/src/gas_setup.js)：`initDonQuijoteDB()` 自動建立 Google Sheet `DON_QUIJOTE_DB` 及 `Equipment_DB` / `Running_Logs` / `CityWalk_Logs` 三個工作表與預設裝備。
- 新增 [gas_api.js](file:///f:/Projects/Don_Quijote_OS/src/gas_api.js)：GAS 後端 Web App API，支援 `getEquipmentList()`、`saveRunningLog()` 與 `saveCityWalkLog()` 並自動累加裝備「累積里程KM」。
- 新增遠征日誌錄入彈窗模組至 [index.html](file:///f:/Projects/Don_Quijote_OS/src/index.html) 與 [style.css](file:///f:/Projects/Don_Quijote_OS/src/style.css)：包含「⚔️ 記錄今日遠征」按鈕、🏃‍♂️ 跑步與 🌇 CityWalk 雙頁籤表單、穿戴裝備動態多選 Chips、體感疲勞 Slider 與星級評分組件。
- 實作一鍵複製 AI Prompt 邏輯至 [app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js)：點擊「📋 儲存並複製 AI 分析 Prompt」時自動備份/儲存數據，並透過 `navigator.clipboard.writeText()` 生成專業格式化的戰報文字供貼給 Gemini。

### Fixed
- 修正 GAS 執行時 `ReferenceError: document is not defined` 錯誤：
  1. 於 [app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) 加入 `typeof document !== 'undefined'` 瀏覽器環境防護。
  2. 新增 [.claspignore](file:///f:/Projects/Don_Quijote_OS/.claspignore)，僅推送 GAS 後端腳本至雲端。
- 修正 GAS Web App 直接存取網址時 `Unknown action: undefined` 錯誤：於 [gas_api.js](file:///f:/Projects/Don_Quijote_OS/src/gas_api.js) `doGet()` 補強 `action` 預設回退機制（當未傳遞 `?action=` 參數時預設執行 `getEquipment`）。
- 建立隱私防護組件：於 [index.html](file:///f:/Projects/Don_Quijote_OS/index.html) 與 [src/index.html](file:///f:/Projects/Don_Quijote_OS/src/index.html) 加入 `noindex, nofollow` Meta 標籤，並建立 [robots.txt](file:///f:/Projects/Don_Quijote_OS/robots.txt)，全面禁止 Google、Bing 等搜尋引擎爬蟲收錄。
## [0.1.2] - 2026-07-26
### Added
- 新增「裝備暱稱 (Equipment Nickname)」自訂欄位與 LocalStorage 本機持久化功能：
  - 於右側 Inspector 詳情面板新增 `🏷️ 裝備暱稱 (Nickname)` 輸入框，支援騎士即時輸入並自動保存至 LocalStorage。
  - 紙娃娃配裝面板裝備格動態連動高亮顯示自訂騎士暱稱 `「暱稱」`。
  - 新建 [.gitignore](file:///f:/Projects/Don_Quijote_OS/.gitignore) 檔案：配置 `__pycache__/`、`.venv/`、`node_modules/` 及系統與編輯器暫存檔之過濾規則。

## [0.1.3] - 2026-08-02
### Added (Task 0.4: Taipei Grand Trail 遠征日誌與 GAS 資料庫連動)
- 新增 [gas_setup.js](file:///f:/Projects/Don_Quijote_OS/src/gas_setup.js) `setupTaipeiGrandTrailLogsSheet()`：自動建立第四個工作表 `TaipeiGrandTrail_Logs` (32 欄位)。
- 擴充 [gas_api.js](file:///f:/Projects/Don_Quijote_OS/src/gas_api.js)：新增 `saveTaipeiGrandTrailLog()` API 寫入台北大縱走紀錄，並升級 `updateEquipmentMileage()` 支援動態對應 `累積里程KM` 欄位與裝備暱稱匹配。
- 升級 [src/index.html](file:///f:/Projects/Don_Quijote_OS/src/index.html) & [index.html](file:///f:/Projects/Don_Quijote_OS/index.html) 遠征彈窗：新增 `🥾 Taipei Grand Trail` 頁籤、縱走段數 1~8 段選單、起終點、路況 Chips 多選（乾燥/潮濕/泥濘/石階/土徑/拉繩/曝曬）、登山遙測、難度 Slider 與 4 組星級評分。
- 更新 [app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) 邏輯：新增 `initRoadChips()` 路況多選狀態管理、`generateTaipeiGrandTrailAIPrompt()` AI 戰報生成器，表單儲存時產出包含 Camino 朝聖預備訓練點評之 Prompt 並一鍵複製。
- 更新 [HANDBOOK.md](file:///f:/Projects/Don_Quijote_OS/HANDBOOK.md) 與 [TASKS.md](file:///f:/Projects/Don_Quijote_OS/TASKS.md)。

## [0.1.4] - 2026-09-30
### Added
- **Garmin Connect 本機授權與測試腳本**：
  - 安裝 `garminconnect` Python 套件。
  - 新增 [scripts/get_garmin_token.py](file:///f:/Projects/Don_Quijote_OS/scripts/get_garmin_token.py)：提供 Garmin 帳密驗證、OAuth tokens 自動儲存至本機 `.garmin_tokens/` 目錄。
  - 新增 [scripts/fetch_latest_activity.py](file:///f:/Projects/Don_Quijote_OS/scripts/fetch_latest_activity.py)：自動讀取本機通行證免密登入、抓取最新 Garmin 活動數據並整齊印出遙測戰報，同時導出完整 [scripts/latest_activity_sample.json](file:///f:/Projects/Don_Quijote_OS/scripts/latest_activity_sample.json) 樣例對照檔。
  - 更新 [.gitignore](file:///f:/Projects/Don_Quijote_OS/.gitignore)：加入 `.garmin_tokens/` 與 `~/.garminconnect` 規則，防止金鑰與權杖洩漏。
- **Task 0.6: Garmin API 微服務與 Don Quijote OS 前台一鍵同步 (Render 雲端部署支援)**：
  - 更新 [scripts/garmin_server.py](file:///f:/Projects/Don_Quijote_OS/scripts/garmin_server.py)：支援從 `PORT` 環境變數動態繫結 `0.0.0.0` 埠號，並支援從 `GARMIN_TOKENS_BASE64` 環境變數自動解碼通行證。
  - 新增 [requirements.txt](file:///f:/Projects/Don_Quijote_OS/requirements.txt)：供 Render 自動辨識 Python 依賴環境。
  - 新增 [scripts/export_tokens_for_render.py](file:///f:/Projects/Don_Quijote_OS/scripts/export_tokens_for_render.py)：提供本機 `.garmin_tokens/` 轉碼 Base64 金鑰匯出腳本。
  - 更新 [src/index.html](file:///f:/Projects/Don_Quijote_OS/src/index.html) & [index.html](file:///f:/Projects/Don_Quijote_OS/index.html) / [src/style.css](file:///f:/Projects/Don_Quijote_OS/src/style.css) & [style.css](file:///f:/Projects/Don_Quijote_OS/style.css)：於 Modal 標頭加入 `【🔄 同步 Garmin 965 最新活動】` 戰術按鈕與加載動畫。
  - 更新 [src/app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) & [app.js](file:///f:/Projects/Don_Quijote_OS/app.js)：實現一鍵 Fetch Garmin 遙測數據，自動切換對應頁籤 (Run/CityWalk/TaipeiGrandTrail) 並自動填入日期、距離、配速、步頻、心率、Z1~Z5 心率區間占比 (%)、垂直振幅及觸地時間。

## [0.1.5] - 2026-10-06
### Added
- **Garmin 活動綁定裝備 (Gear) 自動抓取與連動**：
  - 更新 [scripts/garmin_server.py](file:///f:/Projects/Don_Quijote_OS/scripts/garmin_server.py)：調用 `garmin.get_activity_gear(act_id)` 解析活動關聯裝備清單，新增 `"gear"` 陣列於回傳 API JSON 物件中。
  - 更新 [src/app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) & [app.js](file:///f:/Projects/Don_Quijote_OS/app.js)：同步時自動讀取 `data.gear` 裝備名稱，自動與現有裝備 Chips 匹配勾選，若無現成晶片則動態建立 `🛡️ [Garmin] 裝備名稱` 標籤並自動勾選。

## [0.1.6] - 2026-10-11
### Changed (Task 0.7.1: 今日活動錄入介面字體級數與可讀性舒適度優化)
- **Modal 標頭與操作按鈕視覺放大**：
  - 彈窗標題調大至 `1.45rem`，副標題提升至 `0.95rem`，間距調整更加開闊。
  - 「🔄 同步 Garmin 965 最新活動」按鈕字級調大至 `0.98rem`，內距加大至 `10px 18px`，提升手機點擊觸控熱區。
  - 分頁頁籤按鈕 (Run / CityWalk / Taipei Grand Trail) 字級調大至 `1.05rem`，強化選中時的金光陰影對比。
- **表單輸入框、選單與標籤層次升級**：
  - 所有表單輸入框 (text, number, date)、文字區塊 (textarea) 與下拉選單全面升級至 `16px`（徹底防止 iOS/Safari 觸發強制畫面放大），內距舒適擴增至 `11px 15px`。
  - 欄位標籤 (Labels) 全面調大至 `1rem` 並加粗至 `600`，裝備區標籤放大至 `1.02rem`，提升視覺層次。
  - 數值單位符號 (km, bpm, %, m 等) 放大至 `0.95rem`，避免文字過小。
  - 心率區間 (Z1~Z5) 標籤與數值框尺寸加大，排版更清晰。
- **裝備與路況 Chips 及 Sliders 觸控優化**：
  - 裝備 Chips 與路況 Chips 字級放大至 `0.95rem`，內距擴增至 `8px 16px`，點擊目標更大更友善。
  - 體感疲勞度與路線難度 Slider 數值放大至 `1.25rem` 加粗並帶琥珀光暈；滑桿高度增至 `8px`，拖曳紐擴大至 `22px`。
- **戰術送出按鈕強化**：
  - 「📋 儲存活動並產生 AI 戰報」按鈕字級放大至 `1.1rem`，內距提升至 `13px 28px`，字距拉開，儀式感顯著提升。
- **行動端響應式增強**：
  - 於 `@media (max-width: 768px)` 補強 Modal 滿版適配、header 換行堆疊、分頁滑動與按鈕 100% 寬度觸控佈局。

## [0.1.7] - 2026-10-13
### Fixed (Equipment_DB 寫入與 GAS 雲端部署修復)
- **修復 GAS Web App 部署版本鎖死在 Version 4 之問題**：
  - 診斷出線上 Web App 端點一直固定在 2026 年 8 月的 Version 4，導致 Task 0.7 實作之裝備自動註冊程式碼從未於正式端點生效。
  - 建立 GAS Version 5 並將正式 Deployment `AKfycbxVNWSL4omtaWcTEpQUwKAOwHBLbtDLky7xw8VNPx_LxvJfbEeC1XG8ABHAKp0DReU-0g` 成功重新部署至 Version 5。
- **補強 `Equipment_DB` 表頭防呆與格式容錯機制**：
  - 於 [src/gas_api.js](file:///f:/Projects/Don_Quijote_OS/src/gas_api.js) 新增 `parseGearList()` 支援字串與陣列兩種輸入格式。
  - 當 `Equipment_DB` 工作表為空或首列無標題時，自動補齊預設標題列 (`裝備ID`、`名稱`、`暱稱`、`類別`、`品牌`、`累積里程KM`、`狀態`) 並凍結首列，避免寫入失敗或索引位移。
- **恢復前台 `fetchEquipmentFromGAS()` 雲端裝備同步**：
  - 於 [app.js](file:///f:/Projects/Don_Quijote_OS/app.js) 及 [src/app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) 實作向 GAS API 抓取現有裝備並動態填入 `INVENTORY_DATA`，實現雲端裝備與累積里程自動載入前台。
- **實地雙向驗證完成**：
  - 成功驗證全新裝備（如 `「Banana」 MIZUNO REVOLT 3`）儲存日誌時自動建立新列 `GEAR_001`，且後續日誌可精準匹配並累積里程 (6.5km -> 10km)。











