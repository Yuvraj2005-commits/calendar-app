"use client";

import { useEffect, useRef, useState } from "react";
import { DateRange, SavedNote } from "./types";
import { formatRangeLabel, getRangeKey, toDateKey } from "./utils";

type Props = {
  range: DateRange;
  notes: SavedNote[];
  setNotes: React.Dispatch<React.SetStateAction<SavedNote[]>>;
};

export default function NotesPanel({ range, notes, setNotes }: Props) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "list">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rangeKey = getRangeKey(range.start, range.end);
  const rangeLabel = formatRangeLabel(range.start, range.end);

  // Load existing note for the selected range
  useEffect(() => {
    if (!rangeKey) {
      setText("");
      return;
    }
    const existing = notes.find((n) => n.id === rangeKey);
    setText(existing?.text ?? "");
    setActiveTab("write");
  }, [rangeKey]);

  const persist = (updated: SavedNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem("cal_notes_v3", JSON.stringify(updated));
    } catch {}
  };

  const saveNote = () => {
    if (!text.trim() || !range.start) return;
    const dateKey = toDateKey(range.start);
    const newNote: SavedNote = {
      id: rangeKey,
      dateKey,
      label: rangeLabel,
      text: text.trim(),
      createdAt: Date.now(),
    };
    const filtered = notes.filter((n) => n.id !== rangeKey);
    persist([newNote, ...filtered]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteNote = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
  };

  const hasSelection = !!range.start;
  const hasText = text.trim().length > 0;
  const isExistingNote = notes.some((n) => n.id === rangeKey);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Section header with ruled lines aesthetic */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
      }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#9a9080",
        }}>
          Notes
        </div>
        <div style={{ flex: 1, height: "1px", background: "#e2ddd6" }} />

        {/* Tab switcher */}
        <div style={{
          display: "flex",
          gap: "2px",
          background: "#eee9e3",
          borderRadius: "6px",
          padding: "2px",
        }}>
          {(["write", "list"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                background: activeTab === tab ? "#fff" : "transparent",
                color: activeTab === tab ? "#2563a8" : "#9a9080",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                transition: "all 0.15s",
              }}
            >
              {tab === "write" ? "Write" : `All (${notes.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* WRITE TAB */}
      {activeTab === "write" && (
        <div>
          {/* Lined paper style — shows context label */}
          {hasSelection ? (
            <div style={{
              fontSize: "11px",
              color: "#2563a8",
              fontWeight: 500,
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#2563a8",
                display: "inline-block",
                flexShrink: 0,
              }} />
              {rangeLabel}
              {isExistingNote && (
                <span style={{
                  fontSize: "9px",
                  color: "#9a9080",
                  background: "#f0ece6",
                  padding: "1px 5px",
                  borderRadius: "4px",
                }}>
                  editing
                </span>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: "11px",
              color: "#b0a898",
              marginBottom: "6px",
              fontStyle: "italic",
            }}>
              Select a date or range on the calendar to attach a note
            </div>
          )}

          {/* Lined textarea */}
          <div style={{
            background: "#faf9f6",
            border: "1px solid #e2ddd6",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Ruled lines background */}
            <div style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, #ece8e2 23px, #ece8e2 24px)",
              backgroundPositionY: "12px",
              opacity: 0.6,
            }} />
            {/* Red margin line */}
            <div style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "28px",
              width: "1px",
              background: "rgba(220,100,100,0.25)",
              pointerEvents: "none",
            }} />

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!hasSelection}
              placeholder={hasSelection ? "Write your memo here…" : ""}
              rows={3}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "10px 12px 10px 38px",
                fontSize: "12px",
                lineHeight: "24px",
                color: "#3a3530",
                resize: "none",
                position: "relative",
                zIndex: 1,
                fontFamily: "Georgia, serif",
              }}
            />
          </div>

          <div style={{
            marginTop: "8px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}>
            {hasText && (
              <button
                onClick={() => setText("")}
                style={{
                  fontSize: "11px",
                  color: "#b0a898",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 8px",
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={saveNote}
              disabled={!hasText || !hasSelection}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "6px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: hasText && hasSelection ? "pointer" : "default",
                background: saved
                  ? "#16a34a"
                  : hasText && hasSelection
                  ? "#2563a8"
                  : "#d0c8bc",
                color: hasText && hasSelection ? "#fff" : "#9a9080",
                transition: "background 0.2s",
                letterSpacing: "0.04em",
              }}
            >
              {saved ? "✓ Saved" : isExistingNote ? "Update" : "Save Note"}
            </button>
          </div>
        </div>
      )}

      {/* LIST TAB */}
      {activeTab === "list" && (
        <div style={{ maxHeight: "140px", overflowY: "auto" }}>
          {notes.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#b0a898",
              fontSize: "12px",
              fontStyle: "italic",
              padding: "16px 0",
            }}>
              No notes yet
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {notes.map((note) => (
                <div key={note.id} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "8px 10px",
                  background: "#f5f2ee",
                  borderRadius: "8px",
                  borderLeft: "3px solid #2563a8",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#2563a8",
                      letterSpacing: "0.05em",
                      marginBottom: "2px",
                    }}>
                      {note.label}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#5a5048",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {note.text}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    style={{
                      color: "#c0b8b0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: 1,
                      padding: "0 2px",
                      flexShrink: 0,
                    }}
                    title="Delete note"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}