import { useState, useCallback, useRef, useEffect } from "react";
import {
  Hand, ArrowRight, LifeBuoy, Plus, Octagon, HeartHandshake,
  Utensils, Droplets, Puzzle, Bath, Check, X,
  Volume2, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Data ---

type Category = "action" | "noun" | "social" | "directive";

interface WordDef {
  id: string;
  label: string;
  category: Category;
  icon: React.ElementType;
}

const WORDS: WordDef[] = [
  { id: "want",     label: "Want",     category: "action",    icon: Hand          },
  { id: "go",       label: "Go",       category: "action",    icon: ArrowRight    },
  { id: "help",     label: "Help",     category: "action",    icon: LifeBuoy      },
  { id: "more",     label: "More",     category: "social",    icon: Plus          },
  { id: "stop",     label: "Stop",     category: "directive", icon: Octagon       },
  { id: "please",   label: "Please",   category: "social",    icon: HeartHandshake},
  { id: "eat",      label: "Eat",      category: "noun",      icon: Utensils      },
  { id: "drink",    label: "Drink",    category: "noun",      icon: Droplets      },
  { id: "toy",      label: "Toy",      category: "noun",      icon: Puzzle        },
  { id: "bathroom", label: "Bathroom", category: "noun",      icon: Bath          },
  { id: "yes",      label: "Yes",      category: "directive", icon: Check         },
  { id: "no",       label: "No",       category: "directive", icon: X             },
];

// Per-category pastel palette: background, border, text
const CATEGORY_STYLE: Record<Category, { bg: string; border: string; text: string; activeBg: string }> = {
  action:    { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32", activeBg: "#c8e6c9" },
  noun:      { bg: "#fff8e1", border: "#ffe082", text: "#f57f17", activeBg: "#ffecb3" },
  social:    { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0", activeBg: "#bbdefb" },
  directive: { bg: "#ffebee", border: "#ef9a9a", text: "#b71c1c", activeBg: "#ffcdd2" },
};

// --- TTS ---

const speakText = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(v => (v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en")) ||
    voices.find(v => v.lang.startsWith("en"));
  if (preferred) utterance.voice = preferred;
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
}

// --- Component ---

function CommunicationBoard() {
  const [sentence, setSentence] = useState<WordDef[]>([]);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
  }, []);

  const handleWordTap = useCallback((word: WordDef) => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setActiveWordId(word.id);
    speakText(word.label);
    setSentence(prev => [...prev, word]);
    setTimeout(() => setActiveWordId(null), 150);
    setTimeout(() => { cooldownRef.current = false; }, 500);
  }, []);

  const handleSpeakAll = useCallback(() => {
    if (sentence.length === 0 || cooldownRef.current) return;
    speakText(sentence.map(w => w.label).join(" "));
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 1000);
  }, [sentence]);

  const handleClear = useCallback(() => setSentence([]), []);

  return (
    <div className="aac-root">

      {/* ── Sentence bar ── */}
      <div className="aac-sentence-bar">
        {/* Display area */}
        <div className="aac-display">
          {sentence.length === 0 ? (
            <span className="aac-placeholder">Tap words to build a sentence</span>
          ) : (
            sentence.map((word, i) => {
              const Icon = word.icon;
              const s = CATEGORY_STYLE[word.category];
              return (
                <span
                  key={`${word.id}-${i}`}
                  className="aac-chip"
                  style={{ background: s.bg, borderColor: s.border, color: s.text }}
                >
                  <Icon style={{ width: "1.1em", height: "1.1em", flexShrink: 0 }} strokeWidth={2.5} />
                  {word.label}
                </span>
              );
            })
          )}
        </div>

        {/* Controls */}
        <div className="aac-controls">
          <button
            className="aac-btn-speak"
            onClick={handleSpeakAll}
            disabled={sentence.length === 0}
            aria-label="Speak sentence"
          >
            <Volume2 style={{ width: "1.4rem", height: "1.4rem" }} strokeWidth={2.5} />
            <span>Speak</span>
          </button>
          <button
            className="aac-btn-clear"
            onClick={handleClear}
            disabled={sentence.length === 0}
            aria-label="Clear sentence"
          >
            <Trash2 style={{ width: "1.4rem", height: "1.4rem" }} strokeWidth={2.5} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* ── 3×4 Word Grid ── */}
      <div className="aac-grid-wrapper">
        <div className="aac-grid">
          {WORDS.map(word => {
            const Icon = word.icon;
            const s = CATEGORY_STYLE[word.category];
            const isActive = activeWordId === word.id;
            return (
              <button
                key={word.id}
                className={cn("aac-word-btn", isActive && "aac-word-btn--active")}
                style={{
                  background: isActive ? s.activeBg : s.bg,
                  borderColor: s.border,
                  color: s.text,
                }}
                onClick={() => handleWordTap(word)}
                aria-label={word.label}
              >
                {/* Icon area — fixed relative height */}
                <span className="aac-icon-wrap">
                  <Icon
                    style={{ width: "100%", height: "100%", display: "block" }}
                    strokeWidth={1.8}
                  />
                </span>
                {/* Fluid label */}
                <span className="aac-label">{word.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ── Root layout ── */
        .aac-root {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          width: 100%;
          background: #f7f9fc;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ── Sentence bar ── */
        .aac-sentence-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #ffffff;
          border-bottom: 2px solid #e8ecf0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          flex-shrink: 0;
          min-height: 5rem;
        }

        /* Scrollable display chip area */
        .aac-display {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem;
          min-height: 3.25rem;
          background: #f0f4f8;
          border: 2px dashed #c8d4e0;
          border-radius: 0.875rem;
          padding: 0.4rem 0.6rem;
          overflow-y: auto;
          max-height: 7rem;
        }

        .aac-placeholder {
          width: 100%;
          text-align: center;
          font-size: clamp(0.8rem, 2vw, 1.1rem);
          font-weight: 500;
          color: #9aa5b4;
          letter-spacing: 0.01em;
          pointer-events: none;
        }

        .aac-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3em;
          padding: 0.3em 0.7em;
          border-radius: 0.6rem;
          border: 2px solid;
          font-size: clamp(0.75rem, 1.8vw, 1rem);
          font-weight: 700;
          animation: chipIn 0.18s ease-out;
        }

        /* Controls column */
        .aac-controls {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .aac-btn-speak,
        .aac-btn-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.5rem 0.85rem;
          border-radius: 0.75rem;
          border: 2px solid transparent;
          font-size: clamp(0.7rem, 1.5vw, 0.9rem);
          font-weight: 700;
          cursor: pointer;
          touch-action: manipulation;
          transition: opacity 0.15s, transform 0.12s;
          white-space: nowrap;
          min-width: 5.5rem;
        }

        .aac-btn-speak {
          background: #1e293b;
          color: #ffffff;
        }
        .aac-btn-speak:disabled { background: #cbd5e1; color: #94a3b8; cursor: default; }
        .aac-btn-speak:not(:disabled):active { transform: scale(0.95); }

        .aac-btn-clear {
          background: #ffffff;
          color: #475569;
          border-color: #cbd5e1;
        }
        .aac-btn-clear:disabled { color: #cbd5e1; border-color: #e2e8f0; cursor: default; }
        .aac-btn-clear:not(:disabled):active { transform: scale(0.95); background: #f1f5f9; }

        /* ── Grid wrapper: fluid, max-width centred ── */
        .aac-grid-wrapper {
          flex: 1;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          padding: clamp(0.5rem, 2vw, 1.25rem);
        }

        /* 3-column × 4-row CSS Grid */
        .aac-grid {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: clamp(0.4rem, 1.5vw, 0.875rem);
        }

        /* ── Each word button ── */
        .aac-word-btn {
          /* Flexbox: icon + label centered vertically */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.4rem;

          padding: 0.5rem;          /* safe zone around content */
          border-radius: clamp(0.75rem, 2vw, 1.25rem);
          border: 3px solid;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.1s;
          box-shadow: 0 4px 0 rgba(0,0,0,0.06);
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;         /* keep content inside rounded box */
        }

        .aac-word-btn:active,
        .aac-word-btn--active {
          transform: translateY(3px) scale(0.97);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
        }

        /* Icon wrapper: relative height so it scales with button */
        .aac-icon-wrap {
          flex: 0 0 auto;
          /* Fluid icon height: between 2rem (phone) and 4rem (desktop) */
          height: clamp(2rem, 5vh, 4rem);
          width: clamp(2rem, 5vh, 4rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Fluid label beneath icon */
        .aac-label {
          font-size: clamp(0.72rem, 2vw, 1.3rem);
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          text-align: center;
          /* Prevent wrapping on tiny phones */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        @keyframes chipIn {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        /* ── Responsive tweaks ── */

        /* Very small phones: shrink controls to icon-only */
        @media (max-width: 360px) {
          .aac-btn-speak span,
          .aac-btn-clear span {
            display: none;
          }
          .aac-btn-speak,
          .aac-btn-clear {
            min-width: unset;
            padding: 0.5rem;
          }
        }

        /* Landscape phones: reduce sentence bar height */
        @media (max-height: 500px) {
          .aac-sentence-bar {
            min-height: 3.5rem;
          }
          .aac-display {
            max-height: 4rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return <CommunicationBoard />;
}
