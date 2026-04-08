"use client";

import { useState, useEffect } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import NotesPanel from "@/components/NotesPanel";
import HeroPanel from "@/components/HeroPanel";
import { DateRange, SavedNote } from "@/components/types";

export default function Home() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<SavedNote[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cal_notes_v3");
      if (stored) setNotes(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#e8e4dc] p-4 md:p-8"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Outer calendar card */}
      <div className="w-full max-w-5xl calendar-card rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#fff",
          boxShadow: "0 8px 60px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Spiral binding strip */}
        <div className="spiral-strip w-full flex items-center justify-center"
          style={{
            height: "28px",
            background: "linear-gradient(180deg, #c8c0b0 0%, #a89e8e 100%)",
            position: "relative",
            zIndex: 10,
          }}
        >
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i}
              style={{
                width: "18px",
                height: "22px",
                borderRadius: "9px",
                border: "3px solid #7a7060",
                background: "linear-gradient(135deg, #d4ccc0, #9a9080)",
                margin: "0 6px",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          ))}
        </div>

        {/* Main content: responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Hero image panel */}
          <HeroPanel currentDate={currentDate} />

          {/* RIGHT: Calendar + Notes */}
          <div className="flex flex-col"
            style={{ background: "#faf9f7", minHeight: "580px" }}
          >
            {/* Month/Year header banner */}
            <div style={{
              background: "linear-gradient(135deg, #2563a8 0%, #1a4a8a 100%)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
            }}>
              <span style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                fontFamily: "sans-serif",
                fontWeight: 400,
              }}>
                {currentDate.getFullYear()}
              </span>
              <span style={{
                color: "#fff",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                fontFamily: "sans-serif",
                textTransform: "uppercase",
              }}>
                {currentDate.toLocaleString("default", { month: "long" })}
              </span>
            </div>

            {/* Calendar grid */}
            <div className="flex-1 p-4 md:p-5">
              <CalendarGrid
                range={range}
                setRange={setRange}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                notes={notes}
              />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#e2ddd6", margin: "0 20px" }} />

            {/* Notes panel */}
            <div className="p-4 md:p-5">
              <NotesPanel
                range={range}
                notes={notes}
                setNotes={setNotes}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}