## ADDED Requirements

### Requirement: Add new sutra

The settings page SHALL provide a way to add a new sutra. The user SHALL specify the sutra name and target count. The system SHALL automatically assign a random icon from the 10 available icon files (`sutra-01.png` through `sutra-10.png`).

#### Scenario: Add sutra with valid input

- **WHEN** user enters a sutra name and target count and confirms
- **THEN** a new sutra is created in IndexedDB with a random icon, and it appears in the home page card list

#### Scenario: Random icon assignment

- **WHEN** a new sutra is created
- **THEN** the system assigns one icon filename randomly from `sutra-01.png` to `sutra-10.png`

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

### Requirement: Delete sutra

The settings page SHALL allow deleting a sutra. Deletion SHALL require confirmation to prevent accidental removal.

#### Scenario: Delete with confirmation

- **WHEN** user initiates deletion and confirms
- **THEN** the sutra is removed from IndexedDB and disappears from the home page

#### Scenario: Cancel deletion

- **WHEN** user initiates deletion but cancels
- **THEN** the sutra remains unchanged

### Requirement: Edit user name

The settings page SHALL allow editing the user display name stored in settings.

#### Scenario: Change user name

- **WHEN** user changes name and saves
- **THEN** the new name is persisted in IndexedDB settings
