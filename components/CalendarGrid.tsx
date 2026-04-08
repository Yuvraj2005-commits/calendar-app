"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange, SavedNote } from "./types";
import {
  isSameDay,
  isBeforeDay,
  isBetween,
  isToday,
  toDateKey,
} from "./utils";

type Props = {
  range: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  notes: SavedNote[];
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  text: string;
  dateLabel: string;
};

export default function CalendarGrid({
  range,
  setRange,
  currentDate,
  setCurrentDate,
  notes,
}: Props) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<1 | -1>(1);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
    dateLabel: "",
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  const remainder = daysArray.length % 7;
  if (remainder !== 0) daysArray.push(...Array(7 - remainder).fill(null));

  const noteMap = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const map = new Map<string, string>();
    notes.forEach((n) => {
      const [startKey, endKey] = n.id.includes("__")
        ? n.id.split("__")
        : [n.dateKey, n.dateKey];
      map.set(n.dateKey, n.text);
    });
    noteMap.current = map;
  }, [notes]);

  // Build a per-day note lookup: dateKey → note text
  const dayNoteMap = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const map = new Map<string, string>();
    notes.forEach((n) => map.set(n.dateKey, n.text));
    dayNoteMap.current = map;
  }, [notes]);

  const handleMouseEnter = useCallback(
    (day: number, e: React.MouseEvent<HTMLDivElement>) => {
      const date = new Date(year, month, day);
      setHoverDate(date);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const key = toDateKey(date);
      const noteText = dayNoteMap.current.get(key);

      debounceRef.current = setTimeout(() => {
        if (noteText) {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const gridRect = gridRef.current?.getBoundingClientRect();
          if (!gridRect) return;
          setTooltip({
            visible: true,
            x: rect.left - gridRect.left + rect.width / 2,
            y: rect.top - gridRect.top - 8,
            text: noteText,
            dateLabel: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          });
        }
      }, 300);
    },
    [year, month]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverDate(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

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

  const changeMonth = (dir: 1 | -1) => {
    if (flipping) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + dir, 1));
      setFlipping(false);
    }, 340);
  };

  const getDayState = (day: number) => {
    const date = new Date(year, month, day);
    const effectiveEnd =
      range.start && !range.end && hoverDate ? hoverDate : range.end;

    let start = range.start;
    let end = effectiveEnd;

    if (start && end && isBeforeDay(end, start)) {
      [start, end] = [end, start];
    }

    const isStart = start ? isSameDay(date, start) : false;
    const isEnd = end ? isSameDay(date, end) : false;
    const inRange = start && end ? isBetween(date, start, end) : false;
    const isPreview =
      !range.end && range.start && hoverDate
        ? isBetween(date, ...([range.start, hoverDate].sort((a, b) => a.getTime() - b.getTime()) as [Date, Date]))
        : false;
    const today = isToday(date);
    const hasNote = dayNoteMap.current.has(toDateKey(date));

    return { isStart, isEnd, inRange, isPreview, today, hasNote };
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
  <div className="flex flex-col h-full">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => changeMonth(-1)} className="px-3 py-1 text-zinc-400 hover:text-white">
        ←
      </button>

      <h2 className="text-white text-lg font-semibold">
        {monthName} {year}
      </h2>

      <button onClick={() => changeMonth(1)} className="px-3 py-1 text-zinc-400 hover:text-white">
        →
      </button>
    </div>

    {/* WEEKDAYS */}
    <div className="grid grid-cols-7 text-zinc-500 text-xs mb-2">
      {WEEKDAYS.map((d) => (
        <div key={d} className="text-center">{d}</div>
      ))}
    </div>

    {/* GRID */}
    <div className="grid grid-cols-7 auto-rows-fr gap-[2px] flex-1">

      {daysArray.map((day, idx) => {
        if (!day) return <div key={idx}></div>;

        const { isStart, isEnd, inRange, today } = getDayState(day);

        return (
          <div
            key={idx}
            onClick={() => handleClick(day)}
            className={`
              flex items-center justify-center
              cursor-pointer transition-all
              rounded-md
              ${
                isStart || isEnd
                  ? "bg-white text-black font-bold"
                  : inRange
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }
              ${today ? "ring-1 ring-white" : ""}
            `}
          >
            {day}
          </div>
        );
      })}

    </div>
  </div>
);
}