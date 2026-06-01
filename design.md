# Contextual Design System: Multiplication Table

## Product Frame

This is a Hebrew-first educational web app for children in grades 3-8 who are learning or strengthening multiplication. The app must feel like a calm learning lab: visual, friendly, interactive, and confident without becoming noisy or childish.

Parents and teachers may use the app alongside children, so the interface should be readable for adults while still feeling playful for kids.

## Research-Informed Patterns

Observed patterns from multiplication-learning websites:

- Interactive tables work best when rows, columns, factors, and products are highlighted together.
- Short practice rounds reduce overwhelm and make it easier for kids to restart after mistakes.
- Printable charts are still useful for home, classroom, and fridge practice.
- Rewards should recognize progress, exploration, and persistence, not only speed.
- Multiples games, fact families, and visual arrays help children understand the pattern behind the answer.

Useful reference sites reviewed:

- Times Tables Kids: games, worksheets, speed tests, and suggested learning order.
- Teaching Tables: focused mini-games such as multiples, wheels, and sequencing.
- InkPx interactive multiplication chart: visual row and column highlighting.
- Maths Games: short, varied times-table games.
- TimesBlitz: profiles, progress, avatars, rewards, and low-friction practice.

## Design Personality

- Warm: success feedback should sound supportive, never evaluative or sharp.
- Smart: the app should show mathematical structure, not only answers.
- Energetic: color, motion, and badges make practice feel alive.
- Calm: the child should always know what to do next.
- Bilingual: Hebrew is the default; English is equal in quality.

## Visual Direction

The palette uses multiple learning signals instead of a single dominant hue.

- Ink: `#14324A` for headings, axis cells, and strong contrast.
- Teal: `#087F8C` for primary learning actions and pattern cues.
- Coral: `#FF6B5A` for selected cells and active highlights.
- Yellow: `#F6C945` for achievements and friendly emphasis.
- Green: `#2C9A5F` for success states.
- Soft sky: `#F6FBFF` for the page background.
- White: primary tool surfaces.

Avoid large purple gradients, beige classroom nostalgia, overly dark dashboards, and emoji-based navigation. Use one icon family, currently Lucide.

## Typography

- Prefer system fonts with strong Hebrew support: Assistant, Rubik, Segoe UI, Arial, sans-serif.
- Body text starts at 16px or larger.
- Page headings can be expressive, but compact panels use tighter headings.
- Do not scale text directly with viewport width.
- Keep letter spacing at `0`.

## Layout System

- App shell: left learning sidebar plus main interactive workspace.
- On small screens, sidebar stacks above the workspace.
- First viewport must expose the actual 10x10 interactive table, not a marketing hero.
- The table remains numeric LTR even when the surrounding interface is RTL.
- Touch targets are at least 44px high.
- Cards use 8px radius or less.

## Interaction Rules

- Hover, focus, and tap on a multiplication cell highlight:
  - selected product
  - row factor
  - column factor
  - commutative pair
  - square facts when applicable
- Every selected cell should explain:
  - equation
  - repeated addition
  - commutative fact
  - visual array
  - one pattern clue
- Practice games should be answerable in one tap.
- Mistakes should produce a calm hint and leave the child in control.
- Motion should be quick, purposeful, and disabled under reduced-motion preferences.

## Accessibility

- All interactive controls need visible focus states.
- Icon-only controls must have accessible names; current app favors icon plus text.
- Color is not the only feedback signal.
- Language and direction attributes must update when switching languages.
- Printable content should remain legible in black-and-white contexts.

## Reward System

Badges should reward healthy learning behaviors:

- exploring cells
- building a small streak
- answering a set of questions
- switching language
- printing a practice chart
- finding square numbers
- finding multiples

Do not use shame, loss, penalties, or public ranking.

## Content Tone

Hebrew examples should sound natural to Israeli children and parents. English should be clear and warm rather than literal Hebrew translation.

Preferred tone:

- "בוא נבדוק תבנית"
- "עוד ניסיון קטן"
- "ראית את התבנית"

Avoid:

- "טעית"
- "מהר יותר"
- "זה קל"
- "פשוט תשנן"
