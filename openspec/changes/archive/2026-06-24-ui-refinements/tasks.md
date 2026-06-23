## 1. 網頁標題

- [x] 1.1 [P] 將 `index.html` 的 `<title>` 從「水陸功課進度」改為「水陸功課」。驗證：瀏覽器分頁標題顯示「水陸功課」

## 2. 首頁問候語（Display greeting with user name）

- [x] 2.1 [P] 實作 Display greeting with user name：在 `showHome()` 中呼叫 `getSettings()` 取得 userName，在 `.home-header` 區塊左側渲染問候語文字。userName 非空時顯示「你好，{userName} 菩薩」，為空時顯示「你好，菩薩」。問候語與設定按鈕同列（左文右按鈕）。驗證：開啟首頁，分別在 userName 為空與非空的情況下確認問候語文字正確
- [x] 2.2 新增 `.home-greeting` CSS 樣式，字體大小不小於 `var(--font-size-base)`（18px），顏色使用 `var(--color-text)`，font-weight 700。驗證：問候語在手機尺寸下清晰可讀且不換行擠壓設定按鈕

## 3. 詳情頁簡化（Increment progress / Decrement progress）

- [x] 3.1 [P] 實作 Increment progress 變更並移除 Decrement progress：在 `renderDetail()` 中移除 −1 按鈕（`btn-dec`）及其 click 事件監聽。+1 按鈕文字從「+1」改為「加一部」，使用 `btn-primary` 樣式。確認對話框文字從「確定要將「{name}」的進度 +1 嗎？」改為「確定要將「{name}」加一部嗎？」。驗證：詳情頁只顯示一個「加一部」按鈕，點擊後確認對話框文字正確
- [x] 3.2 調整 `.detail-actions` CSS，將按鈕改為置中全寬顯示（`flex-direction: column; align-items: center`），移除雙按鈕並排的 gap 與 min-width 規則。驗證：「加一部」按鈕在手機尺寸下為全寬顯示，觸控目標足夠大（≥48px 高度）
