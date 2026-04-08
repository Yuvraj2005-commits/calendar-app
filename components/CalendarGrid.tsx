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

/* Holiday type */
type Holiday = {
  name: string;
  date: { iso: string };
};

type Props = {
  range: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  notes: SavedNote[];
  holidays?: Holiday[]; //  optional
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarGrid({
  range,
  setRange,
  currentDate,
  setCurrentDate,
  notes,
  holidays = [], // ✅ default fix (NO CRASH)
}: Props) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    holiday?: string;
    label: string;
    idx: number;
  }>({ visible: false, text: "", holiday: "", label: "", idx: -1 });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const remainder = daysArray.length % 7;
  if (remainder !== 0) {
    daysArray.push(...Array(7 - remainder).fill(null));
  }

  /* ---------------- Notes Map ---------------- */
  const noteMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const map = new Map<string, string>();
    notes.forEach((n) => map.set(n.dateKey, n.text));
    noteMap.current = map;
  }, [notes]);

  /* ---------------- Holiday Finder ---------------- */
  const getHoliday = (date: Date): Holiday | null => {
    if (!holidays.length) return null;

    return (
      holidays.find((h) => {
        const d = new Date(h.date.iso);
        return (
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      }) || null
    );
  };

  /* ---------------- Hover ---------------- */
  const handleEnter = useCallback(
    (day: number, idx: number) => {
      const date = new Date(year, month, day);
      setHoverDate(date);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      const note = noteMap.current.get(toDateKey(date));
      const holiday = getHoliday(date);

      if (note || holiday) {
        debounceRef.current = setTimeout(() => {
          setTooltip({
            visible: true,
            text: note || "",
            holiday: holiday?.name || "",
            label: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            idx,
          });
        }, 200);
      }
    },
    [year, month, holidays]
  );

  const handleLeave = () => {
    setHoverDate(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTooltip((t) => ({ ...t, visible: false }));
  };

  /* ---------------- Click Range ---------------- */
  const handleClick = (day: number) => {
    const clicked = new Date(year, month, day);

    if (!range.start || range.end) {
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

  /* ---------------- Change Month ---------------- */
  const changeMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
    setRange({ start: null, end: null });
  };

  /* ---------------- Day State ---------------- */
  const getDayState = (day: number) => {
    const date = new Date(year, month, day);

    const end =
      range.start && !range.end && hoverDate ? hoverDate : range.end;

    let start = range.start;
    let finish = end;

    if (start && finish && isBeforeDay(finish, start)) {
      [start, finish] = [finish, start];
    }

    return {
      isStart: start && isSameDay(date, start),
      isEnd: finish && isSameDay(date, finish),
      inRange: start && finish && isBetween(date, start, finish),
      today: isToday(date),
      hasNote: noteMap.current.has(toDateKey(date)),
      holiday: getHoliday(date),
    };
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => changeMonth(-1)}>‹</button>
        <h2 className="text-sm font-semibold">
          {monthName} {year}
        </h2>
        <button onClick={() => changeMonth(1)}>›</button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((day, idx) => {
          if (!day) return <div key={idx}></div>;

          const { isStart, isEnd, inRange, today, hasNote, holiday } =
            getDayState(day);

          return (
            <div
              key={idx}
              onClick={() => handleClick(day)}
              onMouseEnter={() => handleEnter(day, idx)}
              onMouseLeave={handleLeave}
              className={`
                h-14 flex items-center justify-center rounded-lg
                cursor-pointer relative transition

                ${
                  isStart || isEnd
                    ? "bg-blue-500 text-white"
                    : inRange
                    ? "bg-blue-100"
                    : "bg-white hover:bg-gray-100"
                }

                ${today ? "border border-blue-400" : ""}
              `}
            >
              {day}

              {/*  Holiday dot */}
              {holiday && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}

              {/*  Note dot */}
              {hasNote && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}

              {/* Tooltip */}
              {tooltip.visible && tooltip.idx === idx && (
                <div className="absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded shadow z-50">
                  <div className="font-semibold">{tooltip.label}</div>

                  {tooltip.holiday && (
                    <div className="text-red-400">{tooltip.holiday}</div>
                  )}

                  {tooltip.text && <div>{tooltip.text}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}