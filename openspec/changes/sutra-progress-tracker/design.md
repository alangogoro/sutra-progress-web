## Context

本專案為全新的行動網頁應用，供水陸法會年長志工追蹤經文誦讀進度。參考專案 `course-quota-web`（桌球課記錄網站）的技術棧與設計模式，但重新設計資料模型與頁面結構。

目標裝置為手機瀏覽器（Android/iOS），使用者年齡層偏高，需要大字體、大觸控目標、簡潔操作流程。

## Goals / Non-Goals

**Goals:**

- 提供直覺的經文進度追蹤介面，操作步驟最少化
- 資料完全本地儲存（IndexedDB），離線可用、無需帳號
- 預設載入 2026 水陸法會 6 套經文，使用者可自行增刪改
- 產出 10 份統一風格的圖示 AI 生成提示詞

**Non-Goals:**

- 雲端同步、多裝置資料共享
- 使用者帳號系統
- PWA Service Worker（首版不做）
- 實際生成圖片檔（僅產出提示詞）

## Decisions

### 技術棧：Vanilla TypeScript + Vite

沿用參考專案的技術棧，不引入任何前端框架。理由：
- 專案功能單純，框架帶來的複雜度不值得
- 年長使用者不需要複雜的互動效果
- 維護成本最低

**替代方案**：使用 Svelte 或 Preact。但對此規模的專案而言，額外的 build 依賴和學習成本不合理。

### 資料模型：IndexedDB 單一 `sutras` store + `settings` store

```typescript
interface Sutra {
  id: string;            // crypto.randomUUID()
  name: string;          // "慈悲三昧水懺"
  icon: string;          // "icons/sutra-01.png"
  targetCount: number;   // 目標部數
  completedCount: number;// 已完成部數
  sortOrder: number;     // 顯示排序
}

interface Settings {
  key: "singleton";
  userName: string;
}
```

每套經文的進度直接存在 `Sutra.completedCount` 欄位，+1/-1 操作直接更新該值。不另建歷史紀錄 store，保持最簡。

**替代方案**：為每次 +1 建立時間戳紀錄（如參考專案的 `records` store）。但本專案不需要知道「何時」完成，只需要「完成幾部」，額外紀錄是不必要的複雜度。

### 頁面路由：手寫 hash router

沿用參考專案的手寫路由模式，頁面包含：
- `home`：經文卡片列表（無標題，直接展示卡片）
- `sutra-detail`：經文內頁（進度顯示 + 加減操作）
- `settings`：設定（使用者名稱 + 經文管理）
- `sutra-edit`：新增/編輯經文表單

使用 hash 參數傳遞經文 ID（如 `#sutra-detail?id=xxx`）。

### 視覺設計：莊嚴暖色調

保留參考專案的核心設計原則（≥18px 字體、48px 觸控目標、圓角卡片），配色調整為：
- 主色：深金色系（取代活潑藍）
- 背景：暖米白色
- 整體氛圍：莊嚴而溫暖

### 經文圖示策略

準備 10 張統一風格的提示詞，由使用者交給 ChatGPT Image 2 生成。圖示大小不超過 120px，僅作裝飾性示意。6 張對應預設經文主題，4 張為泛用佛教元素。新增經文時從 10 張中隨機指派。

圖片檔存放於 `public/icons/sutra-01.png` 至 `sutra-10.png`。

## Implementation Contract

**Behavior**：

- 使用者打開網頁 → 首頁顯示經文卡片列表，首次開啟自動 seed 6 套預設經文
- 點擊卡片 → 進入經文內頁，顯示名稱、圖示、進度條、已完成/目標數字
- 內頁點擊 +1 → `completedCount` 增加 1（不超過 `targetCount`）
- 內頁點擊 -1 → `completedCount` 減少 1（不低於 0）
- 設定頁 → 可修改使用者名稱、新增/編輯/刪除經文
- 新增經文 → 從 `sutra-01` 至 `sutra-10` 中隨機指派一張圖示

**Interface / Data Shape**：

- IndexedDB database: `sutra-progress`，version 1
- Object stores: `sutras`（keyPath: `id`）、`settings`（keyPath: `key`）
- `Sutra` interface 如上述 Decisions 所定義
- DB 模組匯出函式：`getDB()`, `getAllSutras()`, `getSutra(id)`, `updateSutraProgress(id, delta)`, `saveSutra(sutra)`, `deleteSutra(id)`, `getSettings()`, `saveSettings(userName)`

**Failure Modes**：

- IndexedDB 不可用 → 頁面顯示錯誤提示，不 crash
- `completedCount` 不得超出 `[0, targetCount]` 範圍 → clamp 處理
- 導航到不存在的經文 ID → 導回首頁

**Acceptance Criteria**：

- 首次載入後，IndexedDB 包含 6 筆 sutra 資料，名稱與部數與水陸功課佈達一致
- +1/-1 操作即時反映在進度條與數字上
- 新增經文後卡片出現在首頁列表
- 刪除經文後卡片從首頁消失
- 所有按鈕觸控目標 ≥ 48px
- 字體大小 ≥ 18px

**Scope Boundaries**：

- In scope：上述所有頁面、資料層、圖示提示詞
- Out of scope：PWA manifest/Service Worker、雲端同步、多語系、動畫效果、歷史紀錄時間軸

## Risks / Trade-offs

- [IndexedDB 資料遺失] → 使用者清除瀏覽器資料時進度會歸零。Mitigation：首版接受此風險，未來可考慮匯出/匯入功能。
- [無框架的 DOM 操作] → 頁面複雜度增加時維護成本上升。Mitigation：本專案頁面數量少（4 頁），手寫 DOM 在此規模可控。
- [圖示依賴外部生成] → AI 生成的圖片品質不可控。Mitigation：提示詞統一風格與尺寸要求，降低不一致風險。
