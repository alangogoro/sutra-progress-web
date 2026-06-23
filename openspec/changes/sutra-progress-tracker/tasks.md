## 1. 專案初始化

- [ ] [P] 1.1 建立專案骨架，對應 design 決策「技術棧：Vanilla TypeScript + Vite」：初始化 `package.json`（devDependencies: typescript + vite）、`tsconfig.json`、`vite.config.ts`、`index.html`，執行 `npm run dev` 能啟動開發伺服器並顯示空白頁面。驗證：瀏覽器開啟 localhost 看到空白頁面無錯誤。
- [ ] [P] 1.2 建立 CSS 設計系統（`src/styles/base.css`），定義莊嚴暖色調的 design tokens（主色深金色系、暖米白背景、≥18px 字體、48px 觸控目標），對應 design 決策「視覺設計：莊嚴暖色調」。驗證：開發伺服器頁面套用新色系，body 字體 ≥ 18px。

## 2. 資料層（Local Storage）

- [ ] 2.1 實作 IndexedDB 資料庫初始化模組（`src/db/db.ts`），對應 design 決策「資料模型：IndexedDB 單一 `sutras` store + `settings` store」，滿足「IndexedDB database initialization」需求：建立 `sutra-progress` 資料庫（version 1），包含 `sutras`（keyPath: `id`）和 `settings`（keyPath: `key`）兩個 object store。滿足「Graceful IndexedDB failure」需求：`indexedDB.open()` 失敗時在頁面顯示錯誤訊息。驗證：首次開啟 DevTools Application → IndexedDB 可見兩個 store。
- [ ] 2.2 實作首次 seed 邏輯，滿足「Seed default sutras on first open」需求：首次開啟時插入 6 筆預設經文資料（慈悲三昧水懺 3 部、華嚴經普賢行願品 7 部、藥師經 7 部、金剛經 7 部、阿彌陀經 10 部、寶篋印陀羅尼經 21 部），`completedCount` 均為 0，icon 為 `sutra-01.png` 至 `sutra-06.png`。驗證：清除 IndexedDB 後重新載入，確認 6 筆資料存在且欄位正確。
- [ ] 2.3 實作「CRUD operations for sutras」需求的全部匯出函式：`getAllSutras()`（按 `sortOrder` 升冪排序）、`getSutra(id)`、`updateSutraProgress(id, delta)`（clamp 至 `[0, targetCount]`）、`saveSutra(sutra)`、`deleteSutra(id)`。實作「Settings persistence」需求：`getSettings()` 和 `saveSettings(userName)`，預設 userName 為空字串。驗證：在 DevTools Console 呼叫各函式確認回傳值與 IndexedDB 資料一致。

## 3. 頁面路由

- [ ] 3.1 實作手寫 hash router（`src/main.ts`），對應 design 決策「頁面路由：手寫 hash router」。支援 `home`、`sutra-detail`（帶 `id` 參數）、`settings`、`sutra-edit`（帶可選 `id` 參數）四個路由。滿足「Navigate to invalid sutra」需求：導航到不存在的經文 ID 時重導至首頁。驗證：手動修改 URL hash 可切換頁面，無效 ID 自動導回首頁。

## 4. 首頁（Sutra List）

- [ ] 4.1 實作首頁卡片列表，滿足「Display sutra card list on home page」需求：從 IndexedDB 讀取所有經文，按 `sortOrder` 排序，每張卡片顯示圖示（≤120px）、名稱、進度條與「已完成/目標」數字。滿足「No page title on home」需求：首頁不顯示任何 h1/h2 標題。滿足「Settings access from home」需求：右上角顯示設定按鈕。滿足「Navigate to sutra detail」需求：點擊卡片導航至經文內頁。驗證：開啟首頁可見 6 張卡片，無標題，點擊卡片跳轉至內頁，設定按鈕可導航。

## 5. 經文內頁（Sutra Progress）

- [ ] 5.1 實作經文內頁，滿足「Display sutra detail with progress」需求：顯示經文圖示、名稱、進度條與完成數字，提供返回首頁按鈕。滿足「Increment progress」需求：+1 按鈕顯示確認提示，使用者確認後才增加 `completedCount`，取消則不變；已達 `targetCount` 時按鈕 disabled。滿足「Decrement progress」需求：-1 按鈕顯示確認提示，使用者確認後才減少 `completedCount`，取消則不變；已為 0 時按鈕 disabled。驗證：點擊 +1/-1 彈出確認提示，確認後進度更新、取消後不變；邊界值時按鈕為 disabled 狀態。

## 6. 設定頁（Sutra Management）

- [ ] 6.1 實作設定頁面，滿足「Edit user name」需求：提供使用者名稱編輯欄位，儲存至 IndexedDB settings。顯示經文列表，每筆可點擊進入編輯。提供「新增經文」按鈕導航至新增表單。驗證：修改名稱後重新進入設定頁，名稱已更新。
- [ ] 6.2 實作新增/編輯經文表單，滿足「Add new sutra」需求：輸入名稱與目標部數，系統自動從 `sutra-01.png` 至 `sutra-10.png` 隨機指派圖示（「Random icon assignment」）。滿足「Edit existing sutra」需求：可修改名稱與目標部數，若新 targetCount 低於 completedCount 則 clamp（「Edit target count」）。驗證：新增經文後首頁出現新卡片；編輯後資料更新；目標值下調時 completedCount 被 clamp。
- [ ] 6.3 實作刪除經文功能，滿足「Delete sutra」需求：刪除前顯示確認提示（「Delete with confirmation」），取消則不刪除（「Cancel deletion」）。驗證：確認刪除後卡片從首頁消失；取消刪除後卡片仍在。

## 7. 經文圖示提示詞（Icon Prompts）

- [ ] [P] 7.1 撰寫 10 份 ChatGPT Image 2 圖示生成提示詞，對應 design 決策「經文圖示策略」，滿足「Provide 10 icon generation prompts」與「Unified icon style」需求：統一視覺風格、正方形輸出、適合 120px 以下顯示。提示詞 1-6 對應預設經文主題，7-10 為泛用佛教元素。滿足「Icon file naming convention」需求：提示詞中註明對應檔名 `sutra-01.png` 至 `sutra-10.png`，存放於 `public/icons/`。驗證：review 提示詞確認 10 份風格描述一致，檔名對應正確。
