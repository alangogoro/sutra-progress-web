# Icon Prompts

## Purpose

Defines the 10 icon generation prompts used to create sutra icon images via ChatGPT Image 2, ensuring a unified visual style across all icons.

## Requirements

### Requirement: Provide 10 icon generation prompts

The project SHALL include 10 text prompts for generating sutra icon images via ChatGPT Image 2. All 10 prompts SHALL share a unified visual style. Prompts 1-6 SHALL correspond to the 6 default sutras. Prompts 7-10 SHALL depict generic Buddhist visual elements suitable for user-added sutras.

#### Scenario: Prompts delivered as project artifact

- **WHEN** the project artifacts are created
- **THEN** 10 prompts are available in a dedicated file within the change directory or project documentation


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
### Requirement: Unified icon style

All 10 prompts SHALL specify a consistent visual style, output dimensions (square, suitable for display at 120px or smaller), and format guidance. The style SHALL be cohesive so all icons look like they belong to the same set.

#### Scenario: Style consistency across prompts

- **WHEN** all 10 prompts are used to generate images
- **THEN** the resulting images share the same artistic style, color palette, and framing


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
### Requirement: Icon file naming convention

Generated icon files SHALL be named `sutra-01.png` through `sutra-10.png` and placed in the `public/icons/` directory.

#### Scenario: File naming

- **WHEN** images are generated from the prompts
- **THEN** they are saved as `public/icons/sutra-01.png` through `public/icons/sutra-10.png`

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