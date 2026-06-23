## ADDED Requirements

### Requirement: Display sutra card list on home page

The system SHALL display all sutras as a scrollable card list on the home page. Each card SHALL show the sutra icon (max 120px), sutra name, a progress bar, and a completed/target count label. Cards SHALL be ordered by the `sortOrder` field.

#### Scenario: Home page shows all sutras

- **WHEN** user opens the app
- **THEN** all sutras stored in IndexedDB are displayed as cards in `sortOrder` order

#### Scenario: Card displays progress information

- **WHEN** a sutra has completedCount of 2 and targetCount of 7
- **THEN** the card shows a progress bar at approximately 28%, and the text "2/7"

### Requirement: No page title on home

The home page SHALL NOT display a page title or header text. The card list SHALL be the primary content immediately visible.

#### Scenario: Home page has no title

- **WHEN** user views the home page
- **THEN** no heading element (h1, h2) is rendered above the card list

### Requirement: Navigate to sutra detail

Each sutra card SHALL be tappable. Tapping a card SHALL navigate to the sutra detail page for that sutra.

#### Scenario: Tap card navigates to detail

- **WHEN** user taps a sutra card
- **THEN** the app navigates to the sutra detail page showing that sutra's information

### Requirement: Refresh data on navigation back

The home page SHALL re-read all sutra data from IndexedDB each time the user navigates back to it. This ensures that changes made on the sutra detail page (progress updates) or settings page (add, edit, delete) are reflected immediately.

#### Scenario: Progress update reflected on home

- **WHEN** user increments a sutra's progress on the detail page and navigates back to home
- **THEN** the card for that sutra shows the updated completedCount and progress bar

#### Scenario: Deleted sutra removed from home

- **WHEN** user deletes a sutra on the settings page and navigates back to home
- **THEN** the deleted sutra's card is no longer displayed

#### Scenario: New sutra appears on home

- **WHEN** user adds a new sutra on the settings page and navigates back to home
- **THEN** the new sutra's card appears in the list at the correct sortOrder position

### Requirement: Settings access from home

The home page SHALL provide a settings button that navigates to the settings page.

#### Scenario: Settings button visible

- **WHEN** user views the home page
- **THEN** a settings button is visible and tappable
