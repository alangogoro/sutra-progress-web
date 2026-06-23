## ADDED Requirements

### Requirement: Provide 10 icon generation prompts

The project SHALL include 10 text prompts for generating sutra icon images via ChatGPT Image 2. All 10 prompts SHALL share a unified visual style. Prompts 1-6 SHALL correspond to the 6 default sutras. Prompts 7-10 SHALL depict generic Buddhist visual elements suitable for user-added sutras.

#### Scenario: Prompts delivered as project artifact

- **WHEN** the project artifacts are created
- **THEN** 10 prompts are available in a dedicated file within the change directory or project documentation

### Requirement: Unified icon style

All 10 prompts SHALL specify a consistent visual style, output dimensions (square, suitable for display at 120px or smaller), and format guidance. The style SHALL be cohesive so all icons look like they belong to the same set.

#### Scenario: Style consistency across prompts

- **WHEN** all 10 prompts are used to generate images
- **THEN** the resulting images share the same artistic style, color palette, and framing

### Requirement: Icon file naming convention

Generated icon files SHALL be named `sutra-01.png` through `sutra-10.png` and placed in the `public/icons/` directory.

#### Scenario: File naming

- **WHEN** images are generated from the prompts
- **THEN** they are saved as `public/icons/sutra-01.png` through `public/icons/sutra-10.png`
