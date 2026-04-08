"use client";

import { useEffect, useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import NotesPanel from "@/components/NotesPanel";
import HeroPanel from "@/components/HeroPanel";
import { DateRange, SavedNote } from "@/components/types";

export default function Home() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<SavedNote[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cal_notes_v3");
    if (raw) setNotes(JSON.parse(raw));
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex flex-col">

      {/* HERO */}
      <HeroPanel currentDate={currentDate} />

      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">

        {/* CALENDAR */}
        <div className="flex-1 flex flex-col p-4">
          <CalendarGrid
            range={range}
            setRange={setRange}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            notes={notes}
          />
        </div>

        {/* NOTES */}
        <div className="w-[320px] border-l border-zinc-800 p-4 bg-zinc-950">
          <NotesPanel
            range={range}
            notes={notes}
            setNotes={setNotes}
          />
        </div>

      </div>
    </div>
  );
}