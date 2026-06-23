# Sutra Management

## Purpose

Defines the settings page CRUD operations for managing sutras (add, edit, delete) and editing the user display name.

## Requirements

### Requirement: Add new sutra

The settings page SHALL provide a way to add a new sutra. The user SHALL specify the sutra name and target count. The system SHALL automatically assign a random icon from the 10 available icon files (`sutra-01.png` through `sutra-10.png`).

#### Scenario: Add sutra with valid input

- **WHEN** user enters a sutra name and target count and confirms
- **THEN** a new sutra is created in IndexedDB with a random icon, and it appears in the home page card list

#### Scenario: Random icon assignment

- **WHEN** a new sutra is created
- **THEN** the system assigns one icon filename randomly from `sutra-01.png` to `sutra-10.png`


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
### Requirement: Edit existing sutra

The settings page SHALL allow editing an existing sutra's name and target count. The icon SHALL NOT be changed during editing.

#### Scenario: Edit sutra name

- **WHEN** user changes a sutra's name and saves
- **THEN** the updated name is persisted and reflected on the home page

#### Scenario: Edit target count

- **WHEN** user changes a sutra's targetCount to a value lower than the current completedCount
- **THEN** completedCount SHALL be clamped to the new targetCount

##### Example: Target reduction clamps completed

| completedCount | Old targetCount | New targetCount | Result completedCount |
|----------------|-----------------|-----------------|----------------------|
| 5 | 7 | 10 | 5 (unchanged) |
| 5 | 7 | 3 | 3 (clamped) |


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
### Requirement: Delete sutra

The settings page SHALL allow deleting a sutra. Deletion SHALL require confirmation to prevent accidental removal.

#### Scenario: Delete with confirmation

- **WHEN** user initiates deletion and confirms
- **THEN** the sutra is removed from IndexedDB and disappears from the home page

#### Scenario: Cancel deletion

- **WHEN** user initiates deletion but cancels
- **THEN** the sutra remains unchanged


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
### Requirement: Edit user name

The settings page SHALL allow editing the user display name stored in settings.

#### Scenario: Change user name

- **WHEN** user changes name and saves
- **THEN** the new name is persisted in IndexedDB settings

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