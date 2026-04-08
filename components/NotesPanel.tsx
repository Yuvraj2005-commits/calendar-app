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
  const [flash, setFlash] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rangeKey = getRangeKey(range.start, range.end);
  const rangeLabel = formatRangeLabel(range.start, range.end);

  // Load existing note when range changes
  useEffect(() => {
    if (!rangeKey) { setText(""); return; }
    const existing = notes.find((n) => n.id === rangeKey);
    setText(existing?.text ?? "");
    textareaRef.current?.focus();
  }, [rangeKey]);

  const persist = (updated: SavedNote[]) => {
    setNotes(updated);
    localStorage.setItem("cal_notes_v3", JSON.stringify(updated));
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
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  };

  const deleteNote = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const hasText = text.trim().length > 0;

  return (
  <div className="flex flex-col gap-3 h-full">

    <h2 className="text-white text-sm font-semibold">Notes</h2>

    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="w-full h-24 bg-black border border-zinc-700 rounded-lg p-2 text-white"
      placeholder="Write note..."
    />

    <button
      onClick={saveNote}
      className="bg-white text-black py-2 rounded-lg text-sm font-semibold"
    >
      Save
    </button>

  </div>
);
}