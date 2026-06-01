import {
  BadgeCheck,
  BookOpen,
  Brain,
  Check,
  Flame,
  Gamepad2,
  Grid3X3,
  Languages,
  Medal,
  MousePointerClick,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';

type Language = 'he' | 'en';
type Cell = { a: number; b: number };
type Feedback = { tone: 'idle' | 'good' | 'try'; text: string };
type Progress = {
  explored: string[];
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
  huntHits: number;
  badges: string[];
};

const factors = Array.from({ length: 10 }, (_, index) => index + 1);

const gradeTracks = [
  { id: '3', he: 'כיתה ג׳', en: 'Grade 3', tables: [1, 2, 5, 10] },
  { id: '4', he: 'כיתה ד׳', en: 'Grade 4', tables: [3, 4, 6] },
  { id: '5', he: 'כיתה ה׳', en: 'Grade 5', tables: [7, 8, 9] },
  { id: '6-8', he: 'כיתות ו׳-ח׳', en: 'Grades 6-8', tables: factors },
] as const;

const defaultProgress: Progress = {
  explored: [],
  attempts: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  huntHits: 0,
  badges: [],
};

const copy = {
  he: {
    dir: 'rtl' as const,
    otherLanguage: 'English',
    appName: 'לוח הכפל',
    appTag: 'מעבדת כפל אינטראקטיבית',
    title: 'לוח הכפל החי',
    subtitle:
      'נוגעים בתא, רואים תבנית, מתרגלים במשחק קצר, ואוספים ביטחון בלי לחץ.',
    navTitle: 'מסלולי למידה',
    gradeLabel: 'מסלול גיל',
    progress: 'התקדמות',
    explored: 'תאים שנחקרו',
    streak: 'רצף נכון',
    correct: 'תשובות נכונות',
    nav: [
      ['table', 'לוח אינטראקטיבי'],
      ['practice', 'משחקי כפל'],
      ['print', 'תרשים להדפסה'],
      ['badges', 'תגים'],
      ['parents', 'להורים ומורים'],
    ],
    tableTitle: 'לוח 10x10 אינטראקטיבי',
    tableHelp: 'לחצו על כל מכפלה כדי להבליט שורה, עמודה, זוג הפוך והסבר.',
    selectedTitle: 'חלון ההבנה',
    selectedEmpty: 'בחרו תא בלוח כדי להתחיל.',
    repeated: 'חיבור חוזר',
    array: 'מערך',
    commutative: 'חוק החילוף',
    square: 'מספר ריבועי',
    pattern: 'רמז תבנית',
    patterns: {
      five: 'כפולות של 5 מסתיימות ב-0 או 5.',
      ten: 'כפולות של 10 מוסיפות אפס.',
      nine: 'בכפולות של 9 סכום הספרות הוא בדרך כלל 9.',
      two: 'כפול 2 הוא פשוט זוגות.',
      square: 'כששני הגורמים שווים מתקבל ריבוע מושלם.',
      default: 'אפשר להפוך את הגורמים ולקבל אותה תשובה.',
    },
    practiceTitle: 'משחק זריז: מה המכפלה?',
    practiceHelp: 'שאלות קצרות לפי מסלול הגיל. תשובה נכונה מחזקת רצף ופותחת תגים.',
    nextQuestion: 'שאלה חדשה',
    huntTitle: 'ציד כפולות',
    huntHelp: 'בחרו מספר ולחצו רק על הכפולות שלו עד 10.',
    targetTable: 'טבלת',
    huntGood: 'בול. זו כפולה!',
    huntTry: 'קרוב, אבל זה לא במסלול הזה.',
    printTitle: 'תרשים נקי להדפסה',
    printHelp: 'לוח פשוט לבית, לכיתה או למקרר. ההדפסה מסתירה את המשחקים.',
    printButton: 'הדפסה',
    badgesTitle: 'תגי ביטחון',
    badgesHelp: 'התגים מתגמלים חקירה, התמדה, שפה ותבניות.',
    parentTitle: 'גישה פסיכולוגית לילדים שמתקשים',
    parentBody:
      'ילד שלא מבין את לוח הכפל לא צריך עוד לחץ. הוא צריך לראות תבניות, לחוות הצלחות קטנות, ולדעת שטעות היא מידע. מומלץ לתרגל 5-7 דקות, לעצור לפני עייפות, ולחבר כל תרגיל לסיפור חזותי.',
    parentTips: [
      'התחילו מכפולות קלות: 1, 2, 5, 10.',
      'אמרו “בוא נבדוק תבנית” במקום “תזכור כבר”.',
      'השתמשו בשתי דרכים: מערך נקודות וחיבור חוזר.',
      'חגגו אסטרטגיה טובה גם כשהתשובה לא מדויקת.',
    ],
    answerGood: 'מעולה. ראית את התבנית.',
    answerTry: 'עוד ניסיון קטן. חפשו את השורה והעמודה בלוח.',
    answerIdle: 'בחרו תשובה.',
    badges: {
      explorer: ['חוקר/ת תבניות', 'חקרתם 8 תאים בלוח.'],
      calm: ['פותר/ת רגוע/ה', 'הגעתם לרצף של 3 תשובות.'],
      pilot: ['טייס/ת כפל', 'צברתם 10 תשובות נכונות.'],
      bilingual: ['מוח דו-לשוני', 'החלפתם בין עברית לאנגלית.'],
      print: ['מוכן/ה לתרגול', 'פתחתם את לוח ההדפסה.'],
      square: ['מזהה ריבועים', 'מצאתם מכפלה ריבועית.'],
      hunter: ['צייד/ת כפולות', 'מצאתם 8 כפולות במשחק.'],
    },
    gradeFocus: 'מתרגלים עכשיו',
    of: 'מתוך',
  },
  en: {
    dir: 'ltr' as const,
    otherLanguage: 'עברית',
    appName: 'Multiplication Table',
    appTag: 'Interactive multiplication lab',
    title: 'The Living Times Table',
    subtitle:
      'Tap a cell, see the pattern, play a quick round, and build confidence without pressure.',
    navTitle: 'Learning paths',
    gradeLabel: 'Grade path',
    progress: 'Progress',
    explored: 'Cells explored',
    streak: 'Correct streak',
    correct: 'Correct answers',
    nav: [
      ['table', 'Interactive table'],
      ['practice', 'Multiplication games'],
      ['print', 'Printable chart'],
      ['badges', 'Badges'],
      ['parents', 'Parents & teachers'],
    ],
    tableTitle: 'Interactive 10x10 Table',
    tableHelp: 'Tap any product to highlight the row, column, mirror fact, and explanation.',
    selectedTitle: 'Understanding window',
    selectedEmpty: 'Choose a cell in the table to begin.',
    repeated: 'Repeated addition',
    array: 'Array',
    commutative: 'Commutative fact',
    square: 'Square number',
    pattern: 'Pattern clue',
    patterns: {
      five: 'Multiples of 5 end in 0 or 5.',
      ten: 'Multiples of 10 add a zero.',
      nine: 'In multiples of 9, the digits often add to 9.',
      two: 'Times 2 means pairs.',
      square: 'Equal factors make a square number.',
      default: 'Swap the factors and the product stays the same.',
    },
    practiceTitle: 'Quick game: what is the product?',
    practiceHelp: 'Short questions by grade path. Correct answers build a streak and unlock badges.',
    nextQuestion: 'New question',
    huntTitle: 'Multiples Hunt',
    huntHelp: 'Choose a number and tap only its multiples up to 10.',
    targetTable: 'Table',
    huntGood: 'Yes. That is a multiple!',
    huntTry: 'Close, but that one is off this trail.',
    printTitle: 'Clean Printable Chart',
    printHelp: 'A simple board for home, class, or the fridge. Printing hides the games.',
    printButton: 'Print',
    badgesTitle: 'Confidence Badges',
    badgesHelp: 'Badges reward exploration, persistence, language switching, and patterns.',
    parentTitle: 'A child-psychology approach',
    parentBody:
      'A child who struggles with multiplication does not need more pressure. They need visible patterns, small wins, and the message that mistakes are information. Practice for 5-7 minutes, stop before fatigue, and connect each fact to a visual story.',
    parentTips: [
      'Start with friendly tables: 1, 2, 5, 10.',
      'Say “let’s look for a pattern” instead of “just memorize it”.',
      'Use two routes: dot arrays and repeated addition.',
      'Celebrate a good strategy even when the answer is not exact.',
    ],
    answerGood: 'Great. You saw the pattern.',
    answerTry: 'One more try. Look for the row and column on the table.',
    answerIdle: 'Choose an answer.',
    badges: {
      explorer: ['Pattern Explorer', 'You explored 8 table cells.'],
      calm: ['Calm Solver', 'You reached a 3-answer streak.'],
      pilot: ['Table Pilot', 'You collected 10 correct answers.'],
      bilingual: ['Bilingual Brain', 'You switched between Hebrew and English.'],
      print: ['Practice Ready', 'You opened the printable chart.'],
      square: ['Square Spotter', 'You found a square product.'],
      hunter: ['Multiples Hunter', 'You found 8 multiples in the game.'],
    },
    gradeFocus: 'Practicing now',
    of: 'of',
  },
};

const badgeList = [
  { id: 'explorer', Icon: Search },
  { id: 'calm', Icon: ShieldCheck },
  { id: 'pilot', Icon: Trophy },
  { id: 'bilingual', Icon: Languages },
  { id: 'print', Icon: Printer },
  { id: 'square', Icon: Square },
  { id: 'hunter', Icon: Target },
] as const;

function cellId(cell: Cell) {
  return `${cell.a}x${cell.b}`;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeQuestion(tables: readonly number[]) {
  const a = randomItem([...tables]);
  const b = randomItem(factors);
  const answer = a * b;
  const options = new Set<number>([answer]);
  const candidates = [
    a * Math.max(1, b - 1),
    a * Math.min(10, b + 1),
    Math.max(1, answer - a),
    Math.min(100, answer + b),
    randomItem(factors) * randomItem(factors),
  ];

  for (const candidate of candidates) {
    if (candidate >= 1 && candidate <= 100) {
      options.add(candidate);
    }
  }

  for (let offset = 1; options.size < 4 && offset <= 100; offset += 1) {
    const lower = answer - offset;
    const upper = answer + offset;
    if (lower >= 1) options.add(lower);
    if (upper <= 100) options.add(upper);
  }

  return { a, b, answer, options: shuffle([...options]) };
}

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem('multiplication-progress');
    if (!saved) return defaultProgress;

    const parsed = JSON.parse(saved) as Partial<Progress>;
    return {
      explored: Array.isArray(parsed.explored) ? parsed.explored.filter((item) => typeof item === 'string') : [],
      attempts: typeof parsed.attempts === 'number' ? parsed.attempts : 0,
      correct: typeof parsed.correct === 'number' ? parsed.correct : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0,
      huntHits: typeof parsed.huntHits === 'number' ? parsed.huntHits : 0,
      badges: Array.isArray(parsed.badges) ? parsed.badges.filter((item) => typeof item === 'string') : [],
    };
  } catch {
    return defaultProgress;
  }
}

function getPattern(cell: Cell, lang: Language) {
  const text = copy[lang].patterns;

  if (cell.a === cell.b) return text.square;
  if (cell.a === 10 || cell.b === 10) return text.ten;
  if (cell.a === 9 || cell.b === 9) return text.nine;
  if (cell.a === 5 || cell.b === 5) return text.five;
  if (cell.a === 2 || cell.b === 2) return text.two;
  return text.default;
}

function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem('multiplication-progress', JSON.stringify(progress));
  }, [progress]);

  const award = useCallback((badgeId: string) => {
    setProgress((current) => {
      if (current.badges.includes(badgeId)) return current;
      return { ...current, badges: [...current.badges, badgeId] };
    });
  }, []);

  return { progress, setProgress, award };
}

export default function App() {
  const [language, setLanguage] = useState<Language>('he');
  const t = copy[language];
  const [selected, setSelected] = useState<Cell | null>({ a: 3, b: 4 });
  const [hovered, setHovered] = useState<Cell | null>(null);
  const [grade, setGrade] = useState<(typeof gradeTracks)[number]['id']>('3');
  const currentTrack = gradeTracks.find((track) => track.id === grade) ?? gradeTracks[0];
  const { progress, setProgress, award } = useProgress();
  const [question, setQuestion] = useState(() => makeQuestion(currentTrack.tables));
  const [feedback, setFeedback] = useState<Feedback>({ tone: 'idle', text: copy.he.answerIdle });
  const [huntTarget, setHuntTarget] = useState(6);
  const [huntFound, setHuntFound] = useState<number[]>([]);
  const [huntFeedback, setHuntFeedback] = useState('');

  useEffect(() => {
    setQuestion(makeQuestion(currentTrack.tables));
    setFeedback({ tone: 'idle', text: t.answerIdle });
  }, [grade, language, currentTrack.tables, t.answerIdle]);

  useEffect(() => {
    if (progress.explored.length >= 8) award('explorer');
    if (progress.bestStreak >= 3) award('calm');
    if (progress.correct >= 10) award('pilot');
    if (progress.huntHits >= 8) award('hunter');
  }, [award, progress.bestStreak, progress.correct, progress.explored.length, progress.huntHits]);

  const active = hovered ?? selected;
  const exploredPercent = Math.min(100, Math.round((progress.explored.length / 100) * 100));
  const accuracy = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;

  const selectCell = (cell: Cell) => {
    setSelected(cell);
    setProgress((current) => {
      const id = cellId(cell);
      const explored = current.explored.includes(id) ? current.explored : [...current.explored, id];
      return { ...current, explored };
    });

    if (cell.a === cell.b) award('square');
  };

  const switchLanguage = () => {
    setLanguage((current) => (current === 'he' ? 'en' : 'he'));
    award('bilingual');
  };

  const answerQuestion = (option: number) => {
    const isCorrect = option === question.answer;

    setProgress((current) => {
      const streak = isCorrect ? current.streak + 1 : 0;
      return {
        ...current,
        attempts: current.attempts + 1,
        correct: current.correct + (isCorrect ? 1 : 0),
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
      };
    });

    setFeedback({
      tone: isCorrect ? 'good' : 'try',
      text: isCorrect ? t.answerGood : t.answerTry,
    });

    if (isCorrect) {
      window.setTimeout(() => {
        setQuestion(makeQuestion(currentTrack.tables));
        setFeedback({ tone: 'idle', text: t.answerIdle });
      }, 650);
    }
  };

  const playHunt = (number: number) => {
    const isTarget = number % huntTarget === 0 && number <= huntTarget * 10;

    if (!isTarget) {
      setHuntFeedback(t.huntTry);
      return;
    }

    setHuntFound((current) => (current.includes(number) ? current : [...current, number]));
    setHuntFeedback(t.huntGood);
    setProgress((current) => ({
      ...current,
      huntHits: current.huntHits + (huntFound.includes(number) ? 0 : 1),
    }));
  };

  const printChart = () => {
    award('print');
    window.print();
  };

  return (
    <div className="app" dir={t.dir} lang={language}>
      <aside className="sidebar">
        <a className="skip-link" href="#table">
          {language === 'he' ? 'דלגו ללוח' : 'Skip to table'}
        </a>

        <div className="brand-block">
          <img src="/array-guide.svg" alt="" className="brand-art" />
          <div>
            <p className="eyebrow">{t.appTag}</p>
            <h1>{t.appName}</h1>
          </div>
        </div>

        <button className="language-button" type="button" onClick={switchLanguage}>
          <Languages aria-hidden="true" />
          <span>{t.otherLanguage}</span>
        </button>

        <nav className="nav-panel" aria-label={t.navTitle}>
          <p className="nav-title">{t.navTitle}</p>
          {t.nav.map(([href, label]) => (
            <a key={href} href={`#${href}`}>
              {href === 'table' && <Grid3X3 aria-hidden="true" />}
              {href === 'practice' && <Gamepad2 aria-hidden="true" />}
              {href === 'print' && <Printer aria-hidden="true" />}
              {href === 'badges' && <Medal aria-hidden="true" />}
              {href === 'parents' && <Users aria-hidden="true" />}
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <section className="grade-panel" aria-labelledby="grade-title">
          <p className="nav-title" id="grade-title">
            {t.gradeLabel}
          </p>
          <div className="grade-options" role="list">
            {gradeTracks.map((track) => (
              <button
                type="button"
                className={track.id === grade ? 'selected' : ''}
                key={track.id}
                onClick={() => setGrade(track.id)}
              >
                <span>{language === 'he' ? track.he : track.en}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="progress-panel" aria-labelledby="progress-title">
          <p className="nav-title" id="progress-title">
            {t.progress}
          </p>
          <ProgressLine label={t.explored} value={`${progress.explored.length}/100`} percent={exploredPercent} />
          <ProgressLine label={t.correct} value={`${progress.correct}`} percent={Math.min(100, accuracy)} />
          <ProgressLine label={t.streak} value={`${progress.bestStreak}`} percent={Math.min(100, progress.bestStreak * 10)} />
        </section>
      </aside>

      <main className="main-shell">
        <section className="top-band" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">{t.gradeFocus}: {currentTrack.tables.join(', ')}</p>
            <h2 id="page-title">{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>
          <div className="stat-strip" aria-label={t.progress}>
            <Stat icon={<MousePointerClick />} label={t.explored} value={progress.explored.length} />
            <Stat icon={<Flame />} label={t.streak} value={progress.bestStreak} />
            <Stat icon={<Check />} label={t.correct} value={progress.correct} />
          </div>
        </section>

        <section className="lab-grid" id="table" aria-labelledby="table-title">
          <div className="tool-panel table-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.tableHelp}</p>
                <h3 id="table-title">{t.tableTitle}</h3>
              </div>
              <BadgeCheck aria-hidden="true" />
            </div>

            <MultiplicationGrid
              active={active}
              selected={selected}
              onHover={setHovered}
              onSelect={selectCell}
              language={language}
            />
          </div>

          <InsightPanel cell={selected} language={language} />
        </section>

        <section className="learning-band" id="practice" aria-labelledby="practice-title">
          <PracticeGame
            question={question}
            feedback={feedback}
            onAnswer={answerQuestion}
            onNext={() => {
              setQuestion(makeQuestion(currentTrack.tables));
              setFeedback({ tone: 'idle', text: t.answerIdle });
            }}
            language={language}
          />

          <MultiplesHunt
            target={huntTarget}
            found={huntFound}
            feedback={huntFeedback}
            language={language}
            onTarget={(target) => {
              setHuntTarget(target);
              setHuntFound([]);
              setHuntFeedback('');
            }}
            onPick={playHunt}
          />
        </section>

        <PrintableChart language={language} onPrint={printChart} />

        <section className="badges-band" id="badges" aria-labelledby="badges-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.badgesHelp}</p>
              <h3 id="badges-title">{t.badgesTitle}</h3>
            </div>
            <Medal aria-hidden="true" />
          </div>
          <div className="badge-grid">
            {badgeList.map(({ id, Icon }) => {
              const unlocked = progress.badges.includes(id);
              const [label, description] = t.badges[id];
              return (
                <article className={unlocked ? 'badge-card unlocked' : 'badge-card'} key={id}>
                  <Icon aria-hidden="true" />
                  <div>
                    <h4>{label}</h4>
                    <p>{description}</p>
                  </div>
                  {unlocked && <span className="earned"><Check aria-hidden="true" /></span>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="parent-band" id="parents" aria-labelledby="parent-title">
          <div className="parent-copy">
            <p className="eyebrow">{language === 'he' ? 'הורים, מורים וילדים' : 'Parents, teachers, and kids'}</p>
            <h3 id="parent-title">{t.parentTitle}</h3>
            <p>{t.parentBody}</p>
          </div>
          <div className="tips-list">
            {t.parentTips.map((tip) => (
              <div className="tip-row" key={tip}>
                <Sparkles aria-hidden="true" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgressLine({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="progress-line">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <span className="track" aria-hidden="true">
        <span style={{ inlineSize: `${percent}%` }} />
      </span>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="stat-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MultiplicationGrid({
  active,
  selected,
  onHover,
  onSelect,
  language,
}: {
  active: Cell | null;
  selected: Cell | null;
  onHover: (cell: Cell | null) => void;
  onSelect: (cell: Cell) => void;
  language: Language;
}) {
  const t = copy[language];

  return (
    <div className="table-wrap">
      <div className="multiplication-grid" onPointerLeave={() => onHover(null)}>
        <div className="corner-cell">
          <Grid3X3 aria-hidden="true" />
        </div>
        {factors.map((factor) => (
          <div
            className={active?.b === factor ? 'axis-cell active-axis' : 'axis-cell'}
            key={`top-${factor}`}
          >
            {factor}
          </div>
        ))}
        {factors.map((row) => (
          <Fragment key={`row-${row}`}>
            <div
              className={active?.a === row ? 'axis-cell active-axis' : 'axis-cell'}
              key={`side-${row}`}
            >
              {row}
            </div>
            {factors.map((column) => {
              const product = row * column;
              const isSelected = selected?.a === row && selected?.b === column;
              const isMirror = active?.a === column && active?.b === row && row !== column;
              const isActive = active && (active.a === row || active.b === column);
              const classes = [
                'product-cell',
                isActive ? 'active' : '',
                isSelected ? 'selected' : '',
                isMirror ? 'mirror' : '',
                row === column ? 'square-fact' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  type="button"
                  className={classes}
                  key={`${row}-${column}`}
                  onPointerEnter={() => onHover({ a: row, b: column })}
                  onFocus={() => onHover({ a: row, b: column })}
                  onClick={() => onSelect({ a: row, b: column })}
                  aria-label={`${row} × ${column} = ${product}. ${t.pattern}: ${getPattern({ a: row, b: column }, language)}`}
                >
                  <span>{product}</span>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function InsightPanel({ cell, language }: { cell: Cell | null; language: Language }) {
  const t = copy[language];

  if (!cell) {
    return (
      <aside className="tool-panel insight-panel">
        <h3>{t.selectedTitle}</h3>
        <p>{t.selectedEmpty}</p>
      </aside>
    );
  }

  const product = cell.a * cell.b;
  const additions = Array.from({ length: cell.b }, () => cell.a).join(' + ');
  const dotCount = Math.min(product, 100);

  return (
    <aside className="tool-panel insight-panel">
      <div className="equation-burst" aria-label={`${cell.a} times ${cell.b} equals ${product}`}>
        <span>{cell.a}</span>
        <span>×</span>
        <span>{cell.b}</span>
        <span>=</span>
        <strong>{product}</strong>
      </div>

      <div className="insight-list">
        <div>
          <BookOpen aria-hidden="true" />
          <p>
            <strong>{t.repeated}</strong>
            <span>{additions} = {product}</span>
          </p>
        </div>
        <div>
          <Brain aria-hidden="true" />
          <p>
            <strong>{t.commutative}</strong>
            <span>{cell.b} × {cell.a} = {product}</span>
          </p>
        </div>
        <div>
          <Sparkles aria-hidden="true" />
          <p>
            <strong>{t.pattern}</strong>
            <span>{getPattern(cell, language)}</span>
          </p>
        </div>
      </div>

      <div className="array-box" aria-label={`${t.array}: ${cell.a} by ${cell.b}`}>
        <p>{t.array}</p>
        <div
          className="dot-array"
          style={{
            gridTemplateColumns: `repeat(${cell.b}, minmax(7px, 1fr))`,
          }}
        >
          {Array.from({ length: dotCount }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function PracticeGame({
  question,
  feedback,
  onAnswer,
  onNext,
  language,
}: {
  question: ReturnType<typeof makeQuestion>;
  feedback: Feedback;
  onAnswer: (option: number) => void;
  onNext: () => void;
  language: Language;
}) {
  const t = copy[language];

  return (
    <article className="game-panel" aria-labelledby="practice-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.practiceHelp}</p>
          <h3 id="practice-title">{t.practiceTitle}</h3>
        </div>
        <Gamepad2 aria-hidden="true" />
      </div>
      <div className="question-card">
        <span>{question.a} × {question.b}</span>
        <strong>?</strong>
      </div>
      <div className="answer-grid">
        {question.options.map((option) => (
          <button type="button" key={option} onClick={() => onAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className={`feedback ${feedback.tone}`} role="status">
        {feedback.text}
      </div>
      <button className="secondary-action" type="button" onClick={onNext}>
        <Target aria-hidden="true" />
        <span>{t.nextQuestion}</span>
      </button>
    </article>
  );
}

function MultiplesHunt({
  target,
  found,
  feedback,
  language,
  onTarget,
  onPick,
}: {
  target: number;
  found: number[];
  feedback: string;
  language: Language;
  onTarget: (target: number) => void;
  onPick: (number: number) => void;
}) {
  const t = copy[language];
  const allFound = found.length >= 10;

  return (
    <article className="game-panel" aria-labelledby="hunt-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.huntHelp}</p>
          <h3 id="hunt-title">{t.huntTitle}</h3>
        </div>
        <Target aria-hidden="true" />
      </div>
      <div className="target-selector" role="list" aria-label={t.targetTable}>
        {factors.slice(1).map((factor) => (
          <button
            type="button"
            className={factor === target ? 'selected' : ''}
            key={factor}
            onClick={() => onTarget(factor)}
          >
            {factor}
          </button>
        ))}
      </div>
      <div className="hunt-board">
        {Array.from({ length: 100 }, (_, index) => index + 1).map((number) => {
          const isFound = found.includes(number);
          return (
            <button
              type="button"
              className={isFound ? 'found' : ''}
              key={number}
              onClick={() => onPick(number)}
              aria-pressed={isFound}
            >
              {number}
            </button>
          );
        })}
      </div>
      <div className={`feedback ${allFound ? 'good' : 'idle'}`} role="status">
        {feedback || `${found.length} ${t.of} 10`}
      </div>
    </article>
  );
}

function PrintableChart({ language, onPrint }: { language: Language; onPrint: () => void }) {
  const t = copy[language];

  return (
    <section className="print-band" id="print" aria-labelledby="print-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.printHelp}</p>
          <h3 id="print-title">{t.printTitle}</h3>
        </div>
        <button className="print-action" type="button" onClick={onPrint}>
          <Printer aria-hidden="true" />
          <span>{t.printButton}</span>
        </button>
      </div>
      <div className="print-chart" aria-label={t.printTitle}>
        <div className="corner-cell">×</div>
        {factors.map((factor) => (
          <div className="axis-cell" key={`print-top-${factor}`}>{factor}</div>
        ))}
        {factors.map((row) => (
          <Fragment key={`print-row-${row}`}>
            <div className="axis-cell" key={`print-side-${row}`}>{row}</div>
            {factors.map((column) => (
              <div className="print-cell" key={`print-${row}-${column}`}>
                {row * column}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
