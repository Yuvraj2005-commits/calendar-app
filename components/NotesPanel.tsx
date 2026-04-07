"use client";

import { useEffect, useState } from "react";
import { DateRange, SavedNote } from "./types";
import { formatRangeLabel } from "./utils";

type Props = {
  range: DateRange;
};

export default function NotesPanel({ range }: Props) {
  const [text, setText] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("calendar_notes_v2");
      if (raw) {
        const parsed = JSON.parse(raw) as SavedNote[];
        // Rehydrate Date objects
        const notes = parsed.map((n) => ({
          ...n,
          startDate: n.startDate ? new Date(n.startDate) : null,
          endDate: n.endDate ? new Date(n.endDate) : null,
        }));
        setSavedNotes(notes);
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  // When range changes, load existing note for this range
  useEffect(() => {
    const label = formatRangeLabel(range.start, range.end);
    const existing = savedNotes.find((n) => n.rangeLabel === label);
    setText(existing ? existing.text : "");
  }, [range.start?.getTime(), range.end?.getTime()]);

  const rangeLabel = formatRangeLabel(range.start, range.end);

  const saveNote = () => {
    if (!text.trim()) return;
    const newNote: SavedNote = {
      id: `${Date.now()}`,
      rangeLabel,
      startDate: range.start,
      endDate: range.end,
      text: text.trim(),
      createdAt: Date.now(),
    };

    const filtered = savedNotes.filter((n) => n.rangeLabel !== rangeLabel);
    const updated = [newNote, ...filtered];
    setSavedNotes(updated);
    localStorage.setItem("calendar_notes_v2", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const deleteNote = (id: string) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem("calendar_notes_v2", JSON.stringify(updated));
  };

  const loadNote = (note: SavedNote) => {
    setText(note.text);
    setExpandedId(expandedId === note.id ? null : note.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Notes
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Range label */}
      <div className="text-xs text-white/40 font-medium">
        {range.start ? (
          <>
            <span className="text-white/70">{rangeLabel}</span>
          </>
        ) : (
          <span className="italic">Select dates to attach a note</span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none text-sm leading-relaxed transition"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          range.start
            ? "Add a note for this date range…"
            : "Select dates first…"
        }
        disabled={!range.start}
      />

      {/* Save button */}
      <button
        onClick={saveNote}
        disabled={!text.trim() || !range.start}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          ${
            saved
              ? "bg-green-500/80 text-white"
              : "bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-98"
          }`}
      >
        {saved ? "✓ Saved" : "Save Note"}
      </button>

      {/* Saved notes list */}
      {savedNotes.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            Saved ({savedNotes.length})
          </span>
          {savedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 transition"
                onClick={() => loadNote(note)}
              >
                <span className="text-xs text-white/60 font-medium truncate pr-2">
                  {note.rangeLabel}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-white/30">
                    {expandedId === note.id ? "▲" : "▼"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-white/20 hover:text-red-400 text-xs transition"
                    title="Delete note"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {expandedId === note.id && (
                <div className="px-3 pb-3 text-xs text-white/50 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-2">
                  {note.text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}