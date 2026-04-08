"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange, SavedNote } from "./types";
import { isSameDay, isBeforeDay, isBetween, isToday, toDateKey } from "./utils";

type Props = {
  range: DateRange;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  notes: SavedNote[];
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarGrid({
  range,
  setRange,
  currentDate,
  setCurrentDate,
  notes,
}: Props) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    label: string;
    dayIdx: number;
  }>({ visible: false, text: "", label: "", dayIdx: -1 });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Build note map keyed by dateKey
  const dayNoteMap = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const map = new Map<string, string>();
    notes.forEach((n) => map.set(n.dateKey, n.text));
    dayNoteMap.current = map;
  }, [notes]);

  const handleMouseEnter = useCallback(
    (day: number, idx: number, e: React.MouseEvent<HTMLDivElement>) => {
      const date = new Date(year, month, day);
      setHoverDate(date);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      const key = toDateKey(date);
      const noteText = dayNoteMap.current.get(key);
      if (noteText) {
        debounceRef.current = setTimeout(() => {
          setTooltip({
            visible: true,
            text: noteText,
            label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            dayIdx: idx,
          });
        }, 320);
      }
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
    setFlipping(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + dir, 1));
      setFlipping(false);
      setRange({ start: null, end: null });
    }, 200);
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
        ? isBetween(
            date,
            ...([range.start, hoverDate].sort(
              (a, b) => a.getTime() - b.getTime()
            ) as [Date, Date])
          )
        : false;
    const today = isToday(date);
    const hasNote = dayNoteMap.current.has(toDateKey(date));
    const isSunday = date.getDay() === 0;
    const isSaturday = date.getDay() === 6;

    return { isStart, isEnd, inRange, isPreview, today, hasNote, isSunday, isSaturday };
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Month navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
      }}>
        <button
          onClick={() => changeMonth(-1)}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1.5px solid #d0c8bc",
            background: "#f5f2ee",
            color: "#6b6358",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e8e4dc")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f5f2ee")}
        >
          ‹
        </button>

        <span style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#3a3530",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          {monthName} {year}
        </span>

        <button
          onClick={() => changeMonth(1)}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1.5px solid #d0c8bc",
            background: "#f5f2ee",
            color: "#6b6358",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e8e4dc")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f5f2ee")}
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        marginBottom: "6px",
      }}>
        {WEEKDAYS.map((d, i) => (
          <div key={d} style={{
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: i === 0 || i === 6 ? "#2563a8" : "#9a9080",
            padding: "4px 0",
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "3px",
        position: "relative",
        opacity: flipping ? 0.4 : 1,
        transition: "opacity 0.2s",
      }}>
        {daysArray.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const { isStart, isEnd, inRange, isPreview, today, hasNote, isSunday, isSaturday } =
            getDayState(day);

          const isEndpoint = isStart || isEnd;
          const isWeekend = isSunday || isSaturday;

          // Background color logic
          let bg = "transparent";
          let textColor = isWeekend ? "#2563a8" : "#3a3530";
          let fontWeight = "400";
          let borderRadius = "6px";
          let border = "none";
          let boxShadow = "none";

          if (isEndpoint) {
            bg = "#2563a8";
            textColor = "#fff";
            fontWeight = "700";
            boxShadow = "0 2px 8px rgba(37,99,168,0.4)";
          } else if (inRange) {
            bg = "rgba(37,99,168,0.12)";
            textColor = "#1a4a8a";
            fontWeight = "500";
            // Flatten corners to show as continuous band
            borderRadius = "0";
          } else if (isPreview) {
            bg = "rgba(37,99,168,0.07)";
            textColor = "#2563a8";
            borderRadius = "0";
          }

          if (today && !isEndpoint) {
            border = "1.5px solid #2563a8";
          }

          return (
            <div
              key={idx}
              onClick={() => handleClick(day)}
              onMouseEnter={(e) => handleMouseEnter(day, idx, e)}
              onMouseLeave={handleMouseLeave}
              style={{
                position: "relative",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: bg,
                color: textColor,
                fontWeight,
                fontSize: "12px",
                borderRadius,
                border,
                boxShadow,
                cursor: "pointer",
                transition: "all 0.12s",
                userSelect: "none",
              }}
              onMouseOver={(e) => {
                if (!isEndpoint && !inRange && !isPreview) {
                  e.currentTarget.style.background = "rgba(37,99,168,0.07)";
                  e.currentTarget.style.borderRadius = "6px";
                }
              }}
              onMouseOut={(e) => {
                if (!isEndpoint && !inRange && !isPreview) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {day}

              {/* Note indicator dot */}
              {hasNote && (
                <div style={{
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: isEndpoint ? "rgba(255,255,255,0.8)" : "#2563a8",
                }} />
              )}

              {/* Tooltip */}
              {tooltip.visible && tooltip.dayIdx === idx && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#2a2420",
                  color: "#fff",
                  fontSize: "11px",
                  padding: "5px 8px",
                  borderRadius: "6px",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                  zIndex: 50,
                  pointerEvents: "none",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "2px", color: "#93c5fd" }}>
                    {tooltip.label}
                  </div>
                  <div style={{ opacity: 0.85, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tooltip.text.length > 50 ? tooltip.text.slice(0, 50) + "…" : tooltip.text}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Range hint */}
      {range.start && !range.end && (
        <p style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#9a9080",
          textAlign: "center",
          fontStyle: "italic",
        }}>
          Click another day to complete the range
        </p>
      )}

      {range.start && range.end && (
        <div style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{
            fontSize: "11px",
            color: "#2563a8",
            fontWeight: 500,
          }}>
            {range.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" → "}
            {range.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <button
            onClick={() => setRange({ start: null, end: null })}
            style={{
              fontSize: "10px",
              color: "#9a9080",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            clear
          </button>
        </div>
      )}
    </div>
  );
}