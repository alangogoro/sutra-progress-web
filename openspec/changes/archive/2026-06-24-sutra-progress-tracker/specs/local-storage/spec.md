## ADDED Requirements

### Requirement: IndexedDB database initialization

The system SHALL create an IndexedDB database named `sutra-progress` with version 1, containing two object stores: `sutras` (keyPath: `id`) and `settings` (keyPath: `key`).

#### Scenario: First app open

- **WHEN** user opens the app for the first time
- **THEN** the database is created with both object stores

### Requirement: Seed default sutras on first open

On first database initialization, the system SHALL seed 6 sutra records matching the 2026 water-land ceremony assignments.

#### Scenario: Default data seeded

- **WHEN** the database is newly created (no existing data)
- **THEN** 6 sutra records are inserted with the following data:

##### Example: Default seed data

| sortOrder | name | targetCount | icon |
|-----------|------|-------------|------|
| 1 | 慈悲三昧水懺 | 3 | sutra-01.png |
| 2 | 大方廣佛華嚴經普賢行願品 | 7 | sutra-02.png |
| 3 | 藥師琉璃光如來本願功德經 | 7 | sutra-03.png |
| 4 | 金剛般若波羅蜜經 | 7 | sutra-04.png |
| 5 | 佛說阿彌陀經 | 10 | sutra-05.png |
| 6 | 寶篋印陀羅尼經 | 21 | sutra-06.png |

### Requirement: CRUD operations for sutras

The database module SHALL export functions for all sutra operations: `getAllSutras()`, `getSutra(id)`, `updateSutraProgress(id, delta)`, `saveSutra(sutra)`, `deleteSutra(id)`.

#### Scenario: Get all sutras returns sorted list

- **WHEN** `getAllSutras()` is called
- **THEN** all sutra records are returned sorted by `sortOrder` ascending

#### Scenario: Update progress with delta

- **WHEN** `updateSutraProgress(id, +1)` is called
- **THEN** the sutra's `completedCount` is incremented by 1 and clamped to `[0, targetCount]`

### Requirement: Settings persistence

The database module SHALL export `getSettings()` and `saveSettings(userName)` for reading and writing the singleton settings record.

#### Scenario: Default settings

- **WHEN** the database is newly created
- **THEN** settings contain a default userName (empty string)

### Requirement: Graceful IndexedDB failure

The system SHALL display a user-visible error message if IndexedDB is unavailable or fails to open, rather than silently failing or crashing.

#### Scenario: IndexedDB unavailable

- **WHEN** `indexedDB.open()` fails
- **THEN** the app displays an error message in the page content area
