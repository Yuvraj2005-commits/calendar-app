"use client";

import { useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import NotesPanel from "@/components/NotesPanel";
import HeroPanel from "@/components/HeroPanel";
import { DateRange } from "@/components/types";

const MONTH_BG: Record<number, string> = {
  0:  "from-blue-950 via-slate-900 to-blue-950",
  1:  "from-rose-950 via-pink-950 to-rose-950",
  2:  "from-emerald-950 via-teal-950 to-emerald-950",
  3:  "from-violet-950 via-purple-950 to-violet-950",
  4:  "from-sky-950 via-cyan-950 to-sky-950",
  5:  "from-amber-950 via-orange-950 to-amber-950",
  6:  "from-red-950 via-rose-950 to-red-950",
  7:  "from-orange-950 via-amber-950 to-orange-950",
  8:  "from-teal-950 via-green-950 to-teal-950",
  9:  "from-indigo-950 via-blue-950 to-indigo-950",
  10: "from-slate-950 via-gray-900 to-slate-950",
  11: "from-purple-950 via-indigo-950 to-purple-950",
};

export default function Home() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth();
  const bg = MONTH_BG[month];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bg} p-4 sm:p-6 lg:p-10 flex items-center justify-center transition-all duration-700`}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative max-w-5xl w-full">
        {/* Calendar card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-[2fr_3fr]">
          {/* Hero image — dynamic per month */}
          <HeroPanel currentDate={currentDate} />

          {/* Calendar + Notes */}
          <div className="p-5 sm:p-7 flex flex-col gap-6 text-white">
            <CalendarGrid
              range={range}
              setRange={setRange}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />
            <NotesPanel range={range} />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-4 tracking-wider">
          Click a date to start · Click again to end range
        </p>
      </div>
    </div>
  );
}