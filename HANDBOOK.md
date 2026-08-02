# 🛡️ Don Quijote OS Handbook v0.1.2

> *"Life is the Greatest RPG. We fight monsters weirder than windmills."*

---

## 1. Project Vision (專案願景)
Don Quijote OS 並不是一個單純的裝備管理工具，它是一套**「現代堂吉訶德遠征系統」**。

它的核心目標是：**把現實人生的荒繆與冒險，做成一個值得收藏的 RPG。**

不論是聖雅各朝聖之路（Camino）、泰國日本的遠征，還是在職場對抗那些比風車還可怕的怪獸（老闆的女兒、客戶的怪癖、火山燒蝦沒有火山、導遊走太快、領隊走太慢...），透過裝備、配裝、旅程與經驗累積，打造屬於自己的騎士傳奇。

Don Quijote OS 不追求最快完成，而追求：
- ⚔️ **有趣（Fun）**：不有趣的系統代表設計失敗。
- 🛡️ **想一直打開（Engaging）**：就像 Diablo 的裝備庫，充滿視覺與收藏樂趣。
- 📜 **能陪伴很多年（Long-term）**：每一件裝備都是一段真實回憶。

**未來支援的遠征場景：**
Running / Walking / Camino / Japan Travel / Thailand Travel / Camping / Road Trip / 任何現代堂吉訶德的荒謬遠征。

---

## 2. Design Philosophy (設計哲學)
Don Quijote OS 的核心不是管理物品，而是建立：
$$\text{人} \longrightarrow \text{裝備} \longrightarrow \text{配裝 (Loadout)} \longrightarrow \text{場景} \longrightarrow \text{打包} \longrightarrow \text{遠征} \longrightarrow \text{戰報回饋} \longrightarrow \text{經驗累積}$$

每一次對抗風車的遠征，都應該讓下一次出發更輕鬆、更成熟。所有資料都應該能跨越年份累積，而不是一次性消耗。

---

## 3. Product Principles (產品原則)
1. **騎士精神與好玩優先**：如果最後變成只有冷冰冰的表格與數據，那就是設計失敗。
2. **RPG 視覺體驗優先**：配裝面板要有「正在替自己的騎士穿戴裝備」的儀式感。
3. **極致輕量與模組化**：先做出想讓人天天打開的 MVP，嚴格禁止功能過度膨脹。

---

## 4. MVP Scope (Version 0.1 / Task 0.2)
第一版只做最核心的「配裝與戰報體驗」，包含：
- **Character（騎士人物中央面板）**：可視化裝備插槽（頭部、身體、鞋款、襪款、手錶 屬 **👕 穿戴裝備**；背包、登山杖、手機、行動電源、水壺 屬 **🧰 其他配備**）。中央人形具備互動點擊功能，動態顯示「🏋️ 裝備總重」與「🛡️ 已裝備數量」標籤，點擊可於 Inspector 開啟「騎士戰備總覽」。
- **Inventory（皇家倉庫資料）**：採用 JSON 靜態結構，並與 Google Sheet `Equipment_DB` 雲端連動。
- **Equipment Panel & Nicknames（裝備詳情與自訂暱稱面板）**：點擊裝備格或中央人形後，切換顯示名稱、類別、單重、評分、累積里程、戰力評級與戰鬥備註；支援「🏷️ 裝備暱稱 (Nickname)」自訂功能，Inspector 提供全套裝備快捷編輯列表與隨打即存機制，並透過 `localStorage` 進行本機持久化保存。
- **Loadout（兩組主打遠征預設切換）**：`Running` / `Camino`（支援手機行動端響應式排版）。點擊切換時，全套裝備同步更換並自動計算總重量。
- **Expedition Log Modal（今日活動錄入彈窗）**：提供 `🏃‍♂️ Run`、`🌇 CityWalk` 與 `🥾 Taipei Grand Trail` 三頁籤表單。`Run` 表單支援完整跑力與心率遙測欄位；`Taipei Grand Trail` 支援段數 (1~8段)、起終點、路況 Chips 多選、登山遙測 (爬升/下降m)、心率/疲勞/難度 Slider、Camino 訓練星級評分與騎士復盤欄位。
- **GAS Cloud Integration（Google Apps Script 雲端資料庫）**：自動將日誌寫入 `Running_Logs` (27 欄) / `CityWalk_Logs` / `TaipeiGrandTrail_Logs` (32 欄)；`Equipment_DB` 支援 `暱稱` 欄位與自動里程累加連動機制。
- **AI Prompt Assistant（一鍵複製 AI 戰報 Prompt）**：表單儲存時自動生成包含完整遙測與 Camino 訓練點評的專業戰報格式，一鍵複製供貼給 Gemini 分析。
- **GitHub Pages 全球雲端部署與隱私防護**：支援全雲端存取，並配置 `noindex` 及 `robots.txt` 全面防止搜尋引擎收錄。

---

## 5. Not in MVP (暫延開發清單)
以下功能**全部延期**，不得提前開發：
- Packing Checklist (自動打包清單)
- Journey Logs (遠征日誌進階歷史查詢)
- Equipment XP / Level (裝備經驗值與耐久度)
- Backpack Total Weight (背包重量自動加總)
- Cloud Sync / Login / Shopping (雲端帳號登入與購物系統)

> 💡 *所有突發奇想的新點子，一律放入 `TASKS.MD` 的 `Suggestions` 區塊，等待 PM (Martin) 確認。*

---

## 6. UI & Design Direction (視覺風格)
- **整體風格**：深色、奇幻、RPG 原創設計（帶有西班牙騎士與 Diablo 配裝面板的暗黑浪漫感）。
- **色彩語彙**：深灰/黑底背景、金色/古銅色邊框強調、高品質裝備圖示感。
- **限制**：不得直接複製任何商業遊戲的素材或智慧財產。

---

## 7. AI Collaboration Rules (三方協作家法)
本專案採用 2026 年最高效的三方分工架構：
- 👑 **User (Martin)**：**最高產品經理兼騎士總指揮**。負責靈感、試玩、最終決策。
- 🧠 **Gemini (雲端助手)**：**系統架構師 (System Architect)**。負責宏觀架構設計、Handbook 維護、Task 任務拆解、Code Review 與長期規劃。
- ⚔️ **Antigravity IDE (ANTI)**：**執行工程師 (Engineer)**。負責本機實體檔案撰寫、UI 刻劃、視覺化 Diff 比對與 Git/Clasp 落地。

---

## 8. Development Workflow (開發 SOP)
每次開發只做一件事，嚴格遵循固定循環：
1. **Martin 提出想法**。
2. **Gemini 拆解為精準 Task 指令**。
3. **ANTI 讀取 Handbook 並執行該 Task**，完成代碼落地。
4. **Martin 開啟 IDE / 瀏覽器試玩測試**。
5. **Gemini Review 並決定下一個 Task**。

---

## 9. Antigravity (ANTI) Strict Rules
1. 每次只完成指定 Task，**嚴禁自行擴充未討論的功能**。
2. 每次完成 Task，請自動在 `CHANGELOG.MD` 追加一列開發日誌。
3. 修改程式碼前必須比對 `@HANDBOOK.MD` 的 MVP 範圍。

---

## 10. Project Directory Structure

```
DON_QUIJOTE_OS
├── index.html           # 根目錄全雲端 HTML 介面 (GitHub Pages 部署入口)
├── robots.txt           # 隱私防護防爬蟲設定
├── HANDBOOK.md          # 本家法檔案
├── TASKS.md             # 待辦與建議區塊
├── CHANGELOG.md         # 遠征開發日誌
├── .clasp.json          # GAS Clasp 設定檔
├── .claspignore         # GAS Clasp 推送過濾設定
├── appsscript.json      # GAS 專案設定檔
├── docs/                # 設計文檔
├── assets/              # 圖片與圖示資源
└── src/
    ├── index.html       # 主配裝介面原始檔
    ├── style.css        # 深色奇幻 RPG 樣式表 (含 Modal / Sliders / Chips / HR Zones)
    ├── app.js           # Inventory JSON / Loadout / Modal / AI Prompt / GAS 串接邏輯
    ├── gas_setup.js     # GAS 雲端資料庫 DON_QUIJOTE_DB 自動初始化腳本
    └── gas_api.js       # GAS Web App 後端 API (getEquipment / saveLog / updateMileage)
```

---

## 11. Core Philosophy (核心靈魂)
> *Don Quijote OS 並不是在管理裝備，它是在收藏人生。*
> 
> *每一雙跑步鞋、每一個背上朝聖之路的背包、每一支支撐過膝蓋的登山杖，都不只是物品。把它們以 RPG 的方式保存下來，並在下一次對抗風車時，再次成為你最可靠的盾牌！*

---

## 12. Development Log (開發日誌)
- **2026-07-25 (Task 0.2 完成)**：完成 Google Apps Script 雲端資料庫 `DON_QUIJOTE_DB`（`Equipment_DB` / `Running_Logs` / `CityWalk_Logs`）與 Web App API ([src/gas_api.js](file:///f:/Projects/Don_Quijote_OS/src/gas_api.js)) 部署。於介面導入「⚔️ 記錄今日遠征」彈窗、雙頁籤表單、動態裝備 Chips 多選、疲勞度 Slider、星級評分組件與一鍵複製 AI Prompt 戰報邏輯。成功部署至 GitHub Pages 全球免費雲端網址，並配置 `noindex` 及 [robots.txt](file:///f:/Projects/Don_Quijote_OS/robots.txt) 雙重防爬蟲機制確保隱私。
- **2026-07-25 (UI/Loadout/遙測數據大修訂與功能升級)**：
  - **Loadout 行動端優化與簡化**：優化 Loadout 導覽列在手機行動端的響應式排版，並移除 Japan/Thailand 預設，專注於 Running 與 Camino。
  - **裝備分欄重構與中央人形互動化**：將 10 格裝備劃分為「👕 穿戴裝備」與「🧰 其他配備」兩大類別；中央騎士人形升級為互動式面板，動態顯示總負重與裝備數量標籤，點擊可開啟「騎士戰備總覽」與單項裝備規格切換。
  - **跑步紀錄遙測欄位大補齊**：於 Run 表單擴充跑段/平均配速、最大/平均步頻 (spm)、跑姿力學（移動效率 %、垂直振幅 cm、觸地時間 ms）、平均/最大心率 (bpm) 以及 Z1~Z5 心率區間時間占比 (%), AI Prompt 與 GAS 試算表同步升級支援 27 欄完整紀錄。
  - **2026-07-25 (名稱優化與全端發布)**：主要按鈕更名為「今日活動」、水更名為「水壺」、分頁更名為「Run」與「CityWalk」，並成功執行 clasp push 與 git push 部署至雲端與 GitHub 儲存庫。
- **2026-07-26 (Task 0.3 / 裝備暱稱自訂與雲端連動升級)**：
  - **裝備暱稱 (Equipment Nicknames) 功能落地**：於右側 Inspector 面板新增單項裝備暱稱輸入框與「全套裝備暱稱速查與編輯」快捷列表，支援隨打即存與 `localStorage` 本機持久化；紙娃娃裝備格、遠征日誌 Chips 與 AI Prompt 戰報同步自動帶入自訂暱稱格式 `「暱稱」 官方名稱`。
  - **GAS 雲端資料庫擴充與自動同步**：升級 `Equipment_DB` 試算表結構加入 `暱稱` 欄位，更新 `gas_api.js` API 及 `app.js` 的 `fetchEquipmentFromGAS()`，支援自 Google Sheet 自動抓取裝備與暱稱。
  - **前後端隔離與 clasp 推送防護**：修正 [.claspignore](file:///f:/Projects/Don_Quijote_OS/.claspignore) 推送設定，並為 [src/app.js](file:///f:/Projects/Don_Quijote_OS/src/app.js) 全數 DOM 函式加入 `typeof document === 'undefined'` 安全防護，徹底修復 `ReferenceError: document is not defined` 錯誤。
- **2026-08-02 (Task 0.4 / Taipei Grand Trail 遠征日誌與 GAS 資料庫連動)**：
  - **台北大縱走專屬 Modal 頁籤與 32 欄位表單**：於「今日活動」彈窗新增 `🥾 Taipei Grand Trail` 頁籤、縱走段數 (1~8段) 下拉選單、起終點、路況 Chips 多選、登山遙測 (爬升/下降m)、難度 Slider、Camino 訓練星級評分與騎士復盤欄位。
  - **GAS 雲端資料庫擴充與自動加總里程**：新增 `TaipeiGrandTrail_Logs` 試算表 (32 欄位)，擴充 `gas_api.js` API 處理 `saveTaipeiGrandTrailLog`，並優化 `updateEquipmentMileage` 動態對應標題欄位與暱稱匹配。
  - **AI 戰報生成器升級**：實作 `generateTaipeiGrandTrailAIPrompt()`，表單提交時生成包含 Camino 朝聖訓練備戰點評、裝備 XP 發放與騎士復盤檢討提示詞並一鍵複製。

