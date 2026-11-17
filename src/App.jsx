import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ending, verses } from "./content.js";

const typingLines = verses.flat();
const typingCharacters = typingLines.map((line) => Array.from(line));

const snowflakes = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 43.7 + 11) % 100}%`,
  delay: `${-((i * 7.4) % 24)}s`,
  duration: `${17 + ((i * 3.7) % 16)}s`,
  size: `${1.6 + ((i * 1.17) % 3.2)}px`,
  drift: `${-44 + ((i * 19) % 88)}px`,
  opacity: 0.22 + ((i * 0.11) % 0.38),
}));

function Snowfall() {
  return (
    <div className="snowfall" aria-hidden="true">
      {snowflakes.map((flake, index) => (
        <span
          className="snowflake"
          key={index}
          style={{
            "--left": flake.left,
            "--delay": flake.delay,
            "--duration": flake.duration,
            "--size": flake.size,
            "--drift": flake.drift,
            "--flake-opacity": flake.opacity,
          }}
        />
      ))}
    </div>
  );
}

function CornerFlourish({ right = false }) {
  return (
    <svg
      className={`corner-flourish ${right ? "is-right" : ""}`}
      viewBox="0 0 190 240"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 5 C44 30 45 74 76 91 C117 115 123 153 143 191 C154 214 175 225 187 236" />
      <path d="M36 53 C25 31 22 21 11 11 C42 18 50 35 36 53Z" />
      <path d="M54 76 C47 52 53 35 67 25 C74 45 70 63 54 76Z" />
      <path d="M83 101 C78 80 91 60 105 58 C112 77 103 92 83 101Z" />
      <path d="M102 122 C121 119 137 124 144 141 C124 144 111 140 102 122Z" />
      <path d="M126 163 C126 140 139 130 152 127 C157 147 148 160 126 163Z" />
      <path d="M149 201 C166 191 179 195 187 207 C173 217 160 213 149 201Z" />
      <circle cx="93" cy="112" r="3" />
      <circle cx="112" cy="132" r="2.4" />
    </svg>
  );
}

function EnvelopeScene({ opening, onOpen, reduceMotion }) {
  return (
    <motion.section
      key="envelope"
      className={`intro-stage ${opening ? "is-opening" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24, scale: 0.97 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
      aria-label="Öppna ditt julkort"
    >
      <motion.div
        className="stage-star"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        aria-hidden="true"
      >
        ✧
      </motion.div>
      <p className="overline">Till dig, i juletid</p>
      <h1 className="intro-title">En liten julhälsning</h1>
      <p className="intro-subtitle">Ett litet rim har hittat fram. Vill du se vad det står?</p>

      <button
        className="envelope-button"
        type="button"
        onClick={onOpen}
        disabled={opening}
        aria-label="Öppna kuvertet"
      >
        <div className={`envelope ${opening ? "is-opening" : ""}`} aria-hidden="true">
          <div className="envelope-back" />
          <motion.div
            layoutId="christmas-letter"
            className="envelope-letter"
            animate={opening && !reduceMotion ? { y: -145, scale: 1.025 } : { y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.38, delay: opening ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="envelope-letter-star">✦</span>
            <span className="envelope-letter-text">God Jul</span>
            <span className="envelope-letter-line" />
          </motion.div>
          <div className="envelope-front" />
          <div className="envelope-flap" />
          <div className="wax-seal"><span>✧</span></div>
        </div>
      </button>

      <motion.button
        type="button"
        className="primary-button open-cta"
        onClick={onOpen}
        disabled={opening}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        {opening ? "Öppnar ditt julkort…" : "Öppna julkortet"}
        <span aria-hidden="true">✧</span>
      </motion.button>
      <p className="quiet-hint">Psst… läs innan du öppnar paketet.</p>
    </motion.section>
  );
}

function Poem({ skip, reduceMotion, onComplete }) {
  const [progress, setProgress] = useState({ line: 0, count: 0 });

  useEffect(() => {
    if (skip || reduceMotion) {
      setProgress({ line: typingLines.length, count: 0 });
      onComplete(true);
      return;
    }

    let cancelled = false;
    let timer;
    let line = 0;
    let count = 0;

    function writeNextCharacter() {
      if (cancelled) return;

      if (count < typingCharacters[line].length) {
        const character = typingCharacters[line][count];
        count += 1;
        setProgress({ line, count });

        const delay = /[,.!?]/.test(character)
          ? 210
          : character === " " ? 58 : 32 + (count % 3) * 9;
        timer = window.setTimeout(writeNextCharacter, delay);
      } else {
        line += 1;
        count = 0;
        setProgress({ line, count });

        if (line < typingLines.length) {
          timer = window.setTimeout(writeNextCharacter, line % 2 === 0 ? 850 : 250);
        } else {
          timer = window.setTimeout(() => {
            if (!cancelled) onComplete(true);
          }, 700);
        }
      }
    }

    timer = window.setTimeout(writeNextCharacter, 1950);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [skip, reduceMotion, onComplete]);

  let index = 0;

  return (
    <div className="poem" aria-label="Julrim">
      {verses.map((verse, verseIndex) => (
        <p className="verse" key={verseIndex}>
          {verse.map((line, lineIndex) => {
            const currentIndex = index++;
            const visibleText = skip || reduceMotion || currentIndex < progress.line
              ? line
              : currentIndex === progress.line
                ? typingCharacters[currentIndex].slice(0, progress.count).join("")
                : "";

            return (
              <span
                key={lineIndex}
                className="poem-line"
                aria-label={line}
                style={{
                  position: "relative",
                  width: "fit-content",
                  maxWidth: "100%",
                  marginInline: "auto",
                  textAlign: "left",
                }}
              >
                <span aria-hidden="true" style={{ visibility: "hidden" }}>{line}</span>
                <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
                  {visibleText}
                  {!skip && !reduceMotion && currentIndex === progress.line && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: "0.82em",
                        marginLeft: 3,
                        verticalAlign: "-0.08em",
                        background: "#af8354",
                      }}
                    />
                  )}
                </span>
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

function SparkleBurst({ reduceMotion }) {
  if (reduceMotion) return null;

  return (
    <div className="sparkle-burst" aria-hidden="true">
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const distance = 80 + (index % 3) * 22;
        return (
          <motion.span
            key={index}
            className="burst-star"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance * 0.72 - 20,
              opacity: [0, 1, 0],
              scale: [0.4, 1.15, 0.5],
              rotate: 90 + index * 25,
            }}
            transition={{ duration: 1.8, delay: index * 0.025, ease: "easeOut" }}
          >
            {index % 3 === 0 ? "✦" : "✧"}
          </motion.span>
        );
      })}
    </div>
  );
}

function GiftReveal({ giftOpen, onOpen, reduceMotion }) {
  return (
    <motion.div
      className="gift-section"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.8 }}
    >
      <span className="thin-rule" />
      <p className="gift-eyebrow">En sista liten sak</p>
      <button
        type="button"
        className={`gift-button ${giftOpen ? "is-open" : ""}`}
        onClick={onOpen}
        disabled={giftOpen}
        aria-label="Öppna den sista lilla överraskningen"
      >
        <span className="gift-illustration" aria-hidden="true">
          <span className="gift-lid" />
          <span className="gift-body" />
          <span className="gift-ribbon-vertical" />
          <span className="gift-bow gift-bow-left" />
          <span className="gift-bow gift-bow-right" />
        </span>
        <span className="gift-instruction">{giftOpen ? "Öppnad!" : "Tryck på paketet"}</span>
      </button>

      <AnimatePresence>
        {giftOpen && (
          <motion.div
            className="surprise-message"
            initial={{ opacity: 0, y: 17, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.23 }}
          >
            <SparkleBurst reduceMotion={reduceMotion} />
            <div className="surprise-star" aria-hidden="true">✦</div>
            <p>{ending}</p>
            <span>God jul &amp; gott nytt år ♡</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LetterScene({ skip, onSkip, poemDone, onComplete, giftOpen, onGiftOpen, onReplay, reduceMotion }) {
  return (
    <motion.section
      className="letter-stage"
      key="letter"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      aria-label="Ditt julkort"
    >
      <div className="letter-surround">
        <motion.article
          layoutId="christmas-letter"
          className="letter-paper"
          transition={{ layout: { duration: reduceMotion ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="paper-corner paper-corner-tl" aria-hidden="true" />
          <div className="paper-corner paper-corner-tr" aria-hidden="true" />
          <div className="paper-corner paper-corner-bl" aria-hidden="true" />
          <div className="paper-corner paper-corner-br" aria-hidden="true" />

          <span className="paper-star" aria-hidden="true">✦</span>
          <p className="paper-overline">Ett julrim, bara för dig</p>
          <motion.h1
            className="letter-heading"
            initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.7 }}
            animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.9, ease: [0.2, 0.7, 0.23, 1] }}
          >
            God Jul
          </motion.h1>

          <div className="ornamental-rule" aria-hidden="true"><span>❧</span></div>

          <Poem skip={skip} reduceMotion={reduceMotion} onComplete={onComplete} />

          <AnimatePresence>
            {poemDone && (
              <GiftReveal
                giftOpen={giftOpen}
                onOpen={onGiftOpen}
                reduceMotion={reduceMotion}
              />
            )}
          </AnimatePresence>
        </motion.article>
      </div>

      <div className="letter-actions">
        {!poemDone && (
          <button type="button" onClick={onSkip} className="text-button">Visa hela rimmet</button>
        )}
        <button type="button" onClick={onReplay} className="text-button">↻ Börja om</button>
      </div>
    </motion.section>
  );
}

export default function App() {
  const reduceMotion = Boolean(useReducedMotion());
  const [scene, setScene] = useState("envelope");
  const [opening, setOpening] = useState(false);
  const [skip, setSkip] = useState(false);
  const [poemDone, setPoemDone] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(
      () => {
        setScene("letter");
        window.scrollTo({ top: 0, behavior: "instant" });
      },
      reduceMotion ? 100 : 2100
    );
    return () => window.clearTimeout(timer);
  }, [opening, reduceMotion]);

  function replay() {
    setScene("envelope");
    setOpening(false);
    setSkip(false);
    setPoemDone(false);
    setGiftOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <div className="background-glow" aria-hidden="true" />
      <Snowfall />
      <CornerFlourish />
      <CornerFlourish right />

      <header className="page-header" aria-label="Julkort">
        <span className="header-line" />
        <span className="header-star" aria-hidden="true">✦</span>
        <span>ETT LITET JULKORT</span>
        <span className="header-star" aria-hidden="true">✦</span>
        <span className="header-line" />
      </header>

      <main className="main-stage">
        <LayoutGroup id="julkort-transition">
          <AnimatePresence mode="sync">
            {scene === "envelope" ? (
              <EnvelopeScene
                key="envelope"
                opening={opening}
                onOpen={() => setOpening(true)}
                reduceMotion={reduceMotion}
              />
            ) : (
              <LetterScene
                key="letter"
                skip={skip}
                onSkip={() => {
                  setSkip(true);
                  setPoemDone(true);
                }}
                poemDone={poemDone}
                onComplete={setPoemDone}
                giftOpen={giftOpen}
                onGiftOpen={() => setGiftOpen(true)}
                onReplay={replay}
                reduceMotion={reduceMotion}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>

      <footer className="page-footer"> <span aria-hidden="true">✧</span></footer>
    </div>
  );
}
