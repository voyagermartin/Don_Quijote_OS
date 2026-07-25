# 🛡️ Don Quijote OS Handbook v0.1.1

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

## 4. MVP Scope (Version 0.1)
第一版只做最核心的「配裝體驗」，包含：
- **Character（騎士人物中央面板）**：可視化裝備插槽（Head, Body, Backpack, Watch, Shoes, Socks, Trekking Pole, Phone, Power Bank, Water）。
- **Inventory（皇家倉庫資料）**：採用 JSON 靜態結構，暫不建立複雜資料庫。
- **Equipment Panel（裝備詳情面板）**：點擊裝備後顯示名稱、重量、評分、使用里程、備註、優缺點（與打怪心得）。
- **Loadout（四組遠征預設切換）**：`Running` / `Camino` / `Japan` / `Thailand`。點擊切換時，全套裝備同步更換。

---

## 5. Not in MVP (暫延開發清單)
以下功能**全部延期**，不得提前開發：
- Packing Checklist (自動打包清單)
- Journey Logs (遠征日誌)
- Equipment XP / Level (裝備經驗值與耐久度)
- Backpack Total Weight (背包重量自動加總)
- Cloud Sync / Login / Shopping (雲端同步與帳號系統)

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
├── README.md
├── HANDBOOK.md          # 本家法檔案
├── TASKS.md             # 待辦與建議區塊
├── CHANGELOG.md         # 遠征開發日誌
├── docs/                # 設計文檔
├── assets/              # 圖片與圖示資源
└── src/
    ├── index.html       # 主配裝介面
    ├── style.css        # 深色奇幻 RPG 樣式
    └── app.js           # Inventory JSON 與 Loadout 邏輯
```

---

## 11. Core Philosophy (核心靈魂)
> *Don Quijote OS 並不是在管理裝備，它是在收藏人生。*
> 
> *每一雙跑步鞋、每一個背上朝聖之路的背包、每一支支撐過膝蓋的登山杖，都不只是物品。把它們以 RPG 的方式保存下來，並在下一次對抗風車時，再次成為你最可靠的盾牌！*
