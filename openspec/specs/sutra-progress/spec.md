# Sutra Progress

## Purpose

Defines the sutra detail page with progress increment control, confirmation prompts, and boundary clamping behavior.

## Requirements

### Requirement: Display sutra detail with progress

The sutra detail page SHALL display the sutra icon, name, a progress bar, and "completedCount / targetCount" text. The page SHALL also display a back button to return to the home page.

#### Scenario: Detail page shows sutra info

- **WHEN** user navigates to a sutra detail page
- **THEN** the sutra icon, name, progress bar, and count are displayed


<!-- @trace
source: sutra-progress-tracker
updated: 2026-06-24
code:
  - index.html
  - src/styles/base.css
  - public/icons/sutra-02.png
  - public/icons/sutra-08.png
  - src/main.ts
  - src/db/db.ts
  - public/icons/sutra-07.png
  - public/icons/sutra-01.png
  - docs/icon-prompts.md
  - public/icons/sutra-05.png
  - vitest.config.ts
  - public/icons/sutra-09.png
  - public/icons/sutra-10.png
  - public/icons/sutra-03.png
  - package.json
  - tsconfig.json
  - vite.config.ts
  - public/icons/sutra-04.png
  - public/icons/sutra-06.png
tests:
  - src/smoke.test.ts
  - src/db/db.test.ts
-->

---
### Requirement: Increment progress

The detail page SHALL provide a button labeled "加一部". Pressing it SHALL display a confirmation prompt with the text "確定要將「{sutraName}」加一部嗎？". Only upon user confirmation SHALL the system increment completedCount by 1 and persist the change to IndexedDB. The button SHALL be displayed as a centered, full-width element in the actions area.

#### Scenario: Increment confirmed

- **WHEN** user presses "加一部" and completedCount is less than targetCount
- **THEN** a confirmation prompt is displayed with text "確定要將「{sutraName}」加一部嗎？"
- **WHEN** user confirms
- **THEN** completedCount increases by 1 and the progress bar updates

#### Scenario: Increment cancelled

- **WHEN** user presses "加一部" and a confirmation prompt is displayed
- **WHEN** user cancels
- **THEN** completedCount remains unchanged

#### Scenario: Increment at target cap

- **WHEN** completedCount equals targetCount
- **THEN** the "加一部" button SHALL be disabled and no confirmation prompt is shown

##### Example: Clamping at target

| completedCount | targetCount | Button state | Notes |
|----------------|-------------|--------------|-------|
| 2 | 7 | enabled | Shows confirmation "確定要將「藥師經」加一部嗎？" |
| 7 | 7 | disabled | Already at target |


<!-- @trace
source: ui-refinements
updated: 2026-06-24
code:
  - src/styles/base.css
  - index.html
  - .vite/deps/_metadata.json
  - .vite/deps/package.json
  - src/main.ts
-->

---
### Requirement: Navigate to invalid sutra

The system SHALL handle navigation to a non-existent sutra ID gracefully.

#### Scenario: Invalid sutra ID

- **WHEN** user navigates to a sutra detail page with an ID that does not exist in IndexedDB
- **THEN** the app redirects to the home page

<!-- @trace
source: sutra-progress-tracker
updated: 2026-06-24
code:
  - index.html
  - src/styles/base.css
  - public/icons/sutra-02.png
  - public/icons/sutra-08.png
  - src/main.ts
  - src/db/db.ts
  - public/icons/sutra-07.png
  - public/icons/sutra-01.png
  - docs/icon-prompts.md
  - public/icons/sutra-05.png
  - vitest.config.ts
  - public/icons/sutra-09.png
  - public/icons/sutra-10.png
  - public/icons/sutra-03.png
  - package.json
  - tsconfig.json
  - vite.config.ts
  - public/icons/sutra-04.png
  - public/icons/sutra-06.png
tests:
  - src/smoke.test.ts
  - src/db/db.test.ts
-->