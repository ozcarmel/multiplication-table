# Localization

## Defaults

- Default language: Hebrew.
- Default document direction: RTL.
- Numbers and multiplication equations remain LTR for readability.
- English mode switches the app shell to LTR.

## Hebrew UX Rules

- Use natural Hebrew, not direct translation.
- Keep labels short enough for compact controls.
- Use supportive language:
  - "עוד ניסיון קטן"
  - "בוא נבדוק תבנית"
  - "ראית את התבנית"
- Avoid harsh correction words:
  - "טעית"
  - "לא נכון"
  - "כישלון"

## English UX Rules

- Use plain educational English.
- Avoid babyish wording for older children.
- Keep motivational feedback specific to strategy and pattern recognition.

## Direction Rules

- App shell follows selected language direction.
- Multiplication grids use `direction: ltr`.
- Equation snippets use the multiplication sign `×`.
- Icons should not mirror unless the meaning requires direction.

## Future Content Keys

When the app grows, move copy into structured locale files:

- `he.json`
- `en.json`

All new features should ship with both languages.
