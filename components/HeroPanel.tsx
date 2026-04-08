"use client";

import Image from "next/image";

type Props = {
  currentDate: Date;
};

// 12 distinct monthly images — nature/landscape themed
const MONTHLY_IMAGES = [
  // JAN — Winter / Snow
  "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=80",

  // FEB — Love / Soft aesthetic
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=80",

  // MAR — Spring / Blossoms
 " https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",

  // APR — Fresh flowers / Tulips
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=1200&q=80",

  // MAY — Green fields / Growth
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",

  // JUN — Mountains / Adventure
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",

  // JUL — Lake / Travel vibe
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",

  // AUG — Beach / Summer
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",

  // SEP — Autumn start
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",

  // OCT — Fall leaves
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&q=80",

  // NOV — Fog / Calm / Minimal
  "https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?w=1200&q=80",

  // DEC — Snow / Christmas vibe
  "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=80",
];

export default function HeroPanel({ currentDate }: Props) {
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const imgSrc = MONTHLY_IMAGES[month];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "420px",
        height: "100%",
        background: "#1a2a3a",
      }}
    >
      {/* Hero image */}
      <Image
        src={imgSrc}
        alt={`${monthName} ${year}`}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Subtle dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.45) 100%)",
          zIndex: 1,
        }}
      />

      {/* Diagonal wave accent — matches reference image style */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        {/* SVG wave shape */}
        <svg
          viewBox="0 0 400 90"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "90px" }}
        >
          <path
            d="M0,60 C80,20 160,80 240,40 C300,10 360,55 400,30 L400,90 L0,90 Z"
            fill="#2563a8"
            opacity="0.92"
          />
          <path
            d="M0,75 C60,45 140,85 220,55 C290,28 360,70 400,50 L400,90 L0,90 Z"
            fill="#1a4a8a"
            opacity="0.85"
          />
        </svg>

        {/* Month + Year overlay on the wave */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            right: "20px",
            textAlign: "right",
            zIndex: 3,
          }}
        >
          <div style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "12px",
            letterSpacing: "0.15em",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}>
            {year}
          </div>
          <div style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            fontFamily: "sans-serif",
            textTransform: "uppercase",
            lineHeight: 1.2,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}>
            {monthName}
          </div>
        </div>
      </div>
    </div>
  );
}