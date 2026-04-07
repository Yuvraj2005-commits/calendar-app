"use client";

import Image from "next/image";

type Props = {
  currentDate: Date;
};

// Unsplash images per month — nature/seasonal themes
const MONTH_IMAGES: Record<number, { src: string; alt: string }> = {
  0:  { src: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800", alt: "January winter" },
  1:  { src: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e?w=800", alt: "February cherry blossoms" },
  2:  { src: "https://images.unsplash.com/photo-1490750967868-88df5691166e?w=800", alt: "March spring flowers" },
  3:  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", alt: "April landscape" },
  4:  { src: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800", alt: "May meadow" },
  5:  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", alt: "June beach" },
  6:  { src: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800", alt: "July summer" },
  7:  { src: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800", alt: "August golden fields" },
  8:  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", alt: "September autumn" },
  9:  { src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800", alt: "October fall leaves" },
  10: { src: "https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?w=800", alt: "November fog" },
  11: { src: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800", alt: "December snow" },
};

const GRADIENT_OVERLAYS: Record<number, string> = {
  0:  "from-blue-950/80 via-transparent to-blue-950/40",
  1:  "from-rose-950/80 via-transparent to-rose-950/40",
  2:  "from-emerald-950/80 via-transparent to-emerald-950/40",
  3:  "from-violet-950/80 via-transparent to-violet-950/40",
  4:  "from-sky-950/80 via-transparent to-sky-950/40",
  5:  "from-amber-950/80 via-transparent to-amber-950/40",
  6:  "from-red-950/80 via-transparent to-red-950/40",
  7:  "from-orange-950/80 via-transparent to-orange-950/40",
  8:  "from-teal-950/80 via-transparent to-teal-950/40",
  9:  "from-indigo-950/80 via-transparent to-indigo-950/40",
  10: "from-slate-950/80 via-transparent to-slate-950/40",
  11: "from-purple-950/80 via-transparent to-purple-950/40",
};

export default function HeroPanel({ currentDate }: Props) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const img = MONTH_IMAGES[month];
  const overlay = GRADIENT_OVERLAYS[month];

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const weekday = new Date(year, month, 1).toLocaleString("default", { weekday: "long" });

  return (
    <div className="relative h-56 sm:h-72 md:h-full min-h-[220px] overflow-hidden">
      <Image
        key={img.src}
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover transition-all duration-700"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />

      {/* Month label */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
        <span className="text-white/50 text-xs font-semibold uppercase tracking-[0.2em]">
          {weekday} · 1st
        </span>
        <h1 className="text-white text-4xl font-bold tracking-tight leading-none">
          {monthName}
        </h1>
        <span className="text-white/40 text-lg font-light">{year}</span>
      </div>

      {/* Top binding holes decoration */}
      <div className="absolute top-4 left-0 right-0 flex justify-around pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-black/40 border border-white/20 shadow-inner"
          />
        ))}
      </div>
    </div>
  );
}