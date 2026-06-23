## Why

目前首頁沒有問候語，使用者開啟 App 時缺乏個人化感受。詳情頁的 −1 按鈕增加了誤觸風險，對年長使用者來說操作選項越少越好。網頁標題「水陸功課進度」可以更簡潔。

## What Changes

- 首頁頂部新增問候語：「你好，{userName} 菩薩」；userName 為空時顯示「你好，菩薩」。問候語與設定按鈕同一列（左文右按鈕）
- 詳情頁移除 −1 按鈕及其事件邏輯；+1 按鈕文字從「+1」改為「加一部」；確認對話框文字改為「確定要將「{name}」加一部嗎？」；按鈕改為置中全寬顯示
- 網頁 `<title>` 從「水陸功課進度」改為「水陸功課」

## Non-Goals

- 不新增大頭貼或個人頁面
- 不重新設計卡片佈局
- 不新增「減一部」或「修正進度」的替代操作（如有需要可透過設定頁面編輯 completedCount）

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `sutra-list`: 首頁新增問候語區塊，顯示使用者名稱
- `sutra-progress`: 移除 −1 按鈕，+1 按鈕改為「加一部」文字與全寬佈局

## Impact

- Affected specs: `sutra-list`、`sutra-progress`
- Affected code:
  - Modified: `index.html`、`src/main.ts`、`src/styles/base.css`
