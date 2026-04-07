"use client";

import { DateRange } from "./types";
import { isSameDay, isBeforeDay, isBetween, isToday } from "./utils";
import { useState } from "react";

type Props = {
  range: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_THEMES: Record<number, { from: string; to: string; accent: string }> = {
  0:  { from: "from-blue-950",   to: "to-slate-800",   accent: "bg-blue-400" },
  1:  { from: "from-rose-950",   to: "to-pink-900",    accent: "bg-rose-400" },
  2:  { from: "from-emerald-950",to: "to-teal-900",    accent: "bg-emerald-400" },
  3:  { from: "from-violet-950", to: "to-purple-900",  accent: "bg-violet-400" },
  4:  { from: "from-sky-950",    to: "to-cyan-900",    accent: "bg-sky-400" },
  5:  { from: "from-amber-950",  to: "to-orange-900",  accent: "bg-amber-400" },
  6:  { from: "from-red-950",    to: "to-rose-900",    accent: "bg-red-400" },
  7:  { from: "from-orange-950", to: "to-amber-900",   accent: "bg-orange-400" },
  8:  { from: "from-teal-950",   to: "to-green-900",   accent: "bg-teal-400" },
  9:  { from: "from-indigo-950", to: "to-blue-900",    accent: "bg-indigo-400" },
  10: { from: "from-slate-950",  to: "to-gray-800",    accent: "bg-slate-400" },
  11: { from: "from-purple-950", to: "to-indigo-900",  accent: "bg-purple-400" },
};

export default function CalendarGrid({ range, setRange, currentDate, setCurrentDate }: Props) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [flipping, setFlipping] = useState<"left" | "right" | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const theme = MONTH_THEMES[month];

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  const remainder = daysArray.length % 7;
  if (remainder !== 0) {
    daysArray.push(...Array(7 - remainder).fill(null));
  }

  const handleClick = (day: number) => {
    const clicked = new Date(year, month, day);

    if (!range.start || (range.start && range.end)) {
      setRange({ start: clicked, end: null });
    } else {
      if (isSameDay(clicked, range.start)) {
        setRange({ start: null, end: null });
        return;
      }
      if (isBeforeDay(clicked, range.start)) {
        setRange({ start: clicked, end: range.start });
      } else {
        setRange({ start: range.start, end: clicked });
      }
    }
  };

  const getDayStatus = (day: number) => {
    const date = new Date(year, month, day);
    const today = isToday(date);

    // Determine effective end for hover preview
    const effectiveEnd =
      range.start && !range.end && hoverDate ? hoverDate : range.end;

    const effectiveStart = range.start;

    let start =
      effectiveStart && effectiveEnd && isBeforeDay(effectiveEnd, effectiveStart)
        ? effectiveEnd
        : effectiveStart;
    let end =
      effectiveStart && effectiveEnd && isBeforeDay(effectiveEnd, effectiveStart)
        ? effectiveStart
        : effectiveEnd;

    const isStart = start ? isSameDay(date, start) : false;
    const isEnd = end ? isSameDay(date, end) : false;
    const inRange = start && end ? isBetween(date, start, end) : false;
    const isPreview =
      !range.end && range.start && hoverDate
        ? isBetween(date, range.start, hoverDate) ||
          (isBeforeDay(hoverDate, range.start)
            ? isBetween(date, hoverDate, range.start)
            : false)
        : false;

    return { isStart, isEnd, inRange, today, isPreview };
  };

  const changeMonth = (dir: number) => {
    setFlipping(dir > 0 ? "right" : "left");
    setTimeout(() => {
      const newDate = new Date(year, month + dir, 1);
      setCurrentDate(newDate);
      setFlipping(null);
    }, 180);
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => changeMonth(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-white font-semibold"
          aria-label="Previous month"
        >
          ‹
        </button>

        <h2 className="text-xl font-bold tracking-tight text-white">
          {monthName}{" "}
          <span className="text-white/50 font-normal text-base">{year}</span>
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 text-white font-semibold"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-white/40 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`grid grid-cols-7 gap-1 transition-opacity duration-150 ${
          flipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        style={{ transform: flipping ? `translateX(${flipping === "right" ? "8px" : "-8px"})` : "none", transition: "opacity 0.15s, transform 0.15s" }}
      >
        {daysArray.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const { isStart, isEnd, inRange, today, isPreview } = getDayStatus(day);

          let cellClass =
            "relative flex items-center justify-center rounded-xl text-sm font-medium cursor-pointer transition-all duration-100 aspect-square ";

          if (isStart || isEnd) {
            cellClass += "bg-white text-gray-900 shadow-lg shadow-white/20 scale-105 z-10 ";
          } else if (inRange) {
            cellClass += "bg-white/20 text-white rounded-none ";
          } else if (isPreview) {
            cellClass += "bg-white/10 text-white/80 rounded-none ";
          } else {
            cellClass +=
              "bg-white/5 text-white/80 hover:bg-white/15 hover:text-white hover:scale-105 ";
          }

          return (
            <div
              key={`day-${day}`}
              onClick={() => handleClick(day)}
              onMouseEnter={() => setHoverDate(new Date(year, month, day))}
              onMouseLeave={() => setHoverDate(null)}
              className={cellClass}
              title={`${monthName} ${day}, ${year}`}
            >
              {day}
              {/* Today dot */}
              {today && !isStart && !isEnd && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme.accent}`}
                />
              )}
              {/* Start/End label */}
              {(isStart || isEnd) && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/60 leading-none">
                  {isStart ? "from" : "to"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Range display */}
      {range.start && (
        <div className="mt-4 text-xs text-white/50 text-center font-medium tracking-wide">
          {range.end
            ? `${range.start.toDateString()} → ${range.end.toDateString()}`
            : `Start: ${range.start.toDateString()} — pick end date`}
        </div>
      )}
    </div>
  );
}