## Why

水陸法會參與者（多為年長志工）需要追蹤多套經文的誦讀進度。目前無數位工具可用，僅能依靠紙本或記憶。本專案提供一個離線可用的行動網頁，讓使用者隨時查看與記錄各經文的完成部數。

## What Changes

- 建立全新的單頁應用（SPA），技術棧為 Vanilla TypeScript + Vite
- 使用 IndexedDB 做本地資料儲存，無需後端伺服器或帳號
- 首頁以卡片列表呈現所有經文，每張卡片顯示圖示、名稱與進度
- 點擊卡片進入經文內頁，可執行 +1 / -1 操作更新進度
- 設定頁面可管理經文（新增、編輯、刪除）
- 首次載入時預設 seed 2026 水陸法會的 6 套經文資料
- 準備 10 張經文圖示的 AI 生成提示詞（6 張對應經文 + 4 張備用），統一視覺風格

## Non-Goals

- 不做使用者帳號系統或雲端同步
- 不做多人協作或分享功能
- 不在本次 change 中生成實際圖片檔（僅產出提示詞）
- 不做 PWA 離線 Service Worker（首版暫不處理）

## Capabilities

### New Capabilities

- `sutra-list`: 首頁經文卡片列表，顯示所有經文的圖示、名稱與進度概覽
- `sutra-progress`: 經文內頁，顯示詳細進度並提供 +1 / -1 操作
- `sutra-management`: 設定頁面中的經文管理功能（新增、編輯、刪除經文）
- `local-storage`: IndexedDB 本地資料層，包含經文資料的 CRUD 與首次 seed
- `icon-prompts`: 10 份統一風格的經文圖示 AI 生成提示詞

## Impact

- Affected specs: 以上 5 個新 capability 各需建立對應 spec
- Affected code:
  - New: `index.html`, `src/main.ts`, `src/db/db.ts`, `src/styles/base.css`, `src/features/settings/index.ts`, `public/icons/`（圖示目錄）, `vite.config.ts`, `tsconfig.json`, `package.json`
  - Modified: 無（全新專案）
  - Removed: 無
