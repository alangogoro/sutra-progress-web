## ADDED Requirements

### Requirement: Display sutra detail with progress

The sutra detail page SHALL display the sutra icon, name, a progress bar, and "completedCount / targetCount" text. The page SHALL also display a back button to return to the home page.

#### Scenario: Detail page shows sutra info

- **WHEN** user navigates to a sutra detail page
- **THEN** the sutra icon, name, progress bar, and count are displayed

### Requirement: Increment progress

The detail page SHALL provide a +1 button. Pressing it SHALL display a confirmation prompt. Only upon user confirmation SHALL the system increment `completedCount` by 1 and persist the change to IndexedDB.

#### Scenario: Increment confirmed

- **WHEN** user presses +1 and completedCount is less than targetCount
- **THEN** a confirmation prompt is displayed
- **WHEN** user confirms
- **THEN** completedCount increases by 1 and the progress bar updates

#### Scenario: Increment cancelled

- **WHEN** user presses +1 and a confirmation prompt is displayed
- **WHEN** user cancels
- **THEN** completedCount remains unchanged

#### Scenario: Increment at target cap

- **WHEN** user presses +1 and completedCount equals targetCount
- **THEN** the +1 button SHALL be disabled and no confirmation prompt is shown

##### Example: Clamping at target

| completedCount | targetCount | +1 button state | Notes |
|----------------|-------------|-----------------|-------|
| 2 | 7 | enabled | Normal, shows confirmation on press |
| 7 | 7 | disabled | Already at target |

### Requirement: Decrement progress

The detail page SHALL provide a -1 button. Pressing it SHALL display a confirmation prompt. Only upon user confirmation SHALL the system decrement `completedCount` by 1 and persist the change to IndexedDB.

#### Scenario: Decrement confirmed

- **WHEN** user presses -1 and completedCount is greater than 0
- **THEN** a confirmation prompt is displayed
- **WHEN** user confirms
- **THEN** completedCount decreases by 1 and the progress bar updates

#### Scenario: Decrement cancelled

- **WHEN** user presses -1 and a confirmation prompt is displayed
- **WHEN** user cancels
- **THEN** completedCount remains unchanged

#### Scenario: Decrement at zero floor

- **WHEN** user presses -1 and completedCount is 0
- **THEN** the -1 button SHALL be disabled and no confirmation prompt is shown

### Requirement: Navigate to invalid sutra

The system SHALL handle navigation to a non-existent sutra ID gracefully.

#### Scenario: Invalid sutra ID

- **WHEN** user navigates to a sutra detail page with an ID that does not exist in IndexedDB
- **THEN** the app redirects to the home page
