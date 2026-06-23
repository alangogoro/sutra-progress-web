## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Decrement progress

**Reason**: Simplify the detail page for elderly users by reducing the number of buttons. Accidental taps on −1 are a usability risk. Users who need to correct progress can edit the sutra via the settings page.
**Migration**: Use the settings page sutra edit feature to manually adjust completedCount if a decrement is needed.
