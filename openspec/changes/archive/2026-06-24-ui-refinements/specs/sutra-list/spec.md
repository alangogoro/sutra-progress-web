## ADDED Requirements

### Requirement: Display greeting with user name

The home page SHALL display a greeting message in the header area, on the same row as the settings button (greeting on the left, settings button on the right). The greeting text SHALL be "你好，{userName} 菩薩" where {userName} is the stored user name from settings. When userName is empty, the greeting SHALL display "你好，菩薩" (omitting the name but still showing the greeting). The greeting font size SHALL be at least 18px to meet accessibility standards for elderly users.

#### Scenario: Greeting with user name set

- **WHEN** user opens the home page and userName is "志明"
- **THEN** the greeting displays "你好，志明 菩薩"

#### Scenario: Greeting with empty user name

- **WHEN** user opens the home page and userName is ""
- **THEN** the greeting displays "你好，菩薩"

#### Scenario: Greeting updates after name change

- **WHEN** user changes their name in settings and navigates back to home
- **THEN** the greeting reflects the updated userName

##### Example: Greeting text variations

| userName | Displayed greeting |
|----------|--------------------|
| "志明" | "你好，志明 菩薩" |
| "法喜" | "你好，法喜 菩薩" |
| "" | "你好，菩薩" |
