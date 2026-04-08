"use client";

import Image from "next/image";

type Props = {
  currentDate: Date;
};

// 12 distinct monthly images — nature/landscape themed
const MONTHLY_IMAGES = [
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", // Jan - snowy mountains
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", // Feb - frozen lake
  "https://images.unsplash.com/photo-1490750967868-88df5691166e?w=800&q=80", // Mar - spring blossoms
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", // Apr - tulips
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", // May - green hills
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Jun - alpine
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", // Jul - summer lake
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Aug - beach
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", // Sep - autumn
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80", // Oct - fall forest
  "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=80", // Nov - misty
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", // Dec - winter
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