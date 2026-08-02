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










