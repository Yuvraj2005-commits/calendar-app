"use client";

import Image from "next/image";

type Props = {
  currentDate: Date;
};

const IMAGES: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a",
  1: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e",
  2: "https://images.unsplash.com/photo-1490750967868-88df5691166e",
  3: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  4: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa",
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  6: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e",
  7: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1",
  8: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  9: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071",
  10: "https://images.unsplash.com/photo-1511131341194-24e2eeeebb09",
  11: "https://images.unsplash.com/photo-1491002052546-bf38f186af56",
};

export default function HeroPanel({ currentDate }: Props) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="relative h-40 w-full border-b border-zinc-800">
      <Image
        src={IMAGES[month]}
        alt="calendar"
        fill
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute left-6 bottom-4">
        <p className="text-zinc-400 text-xs">{year}</p>
        <h1 className="text-white text-3xl font-bold">{monthName}</h1>
      </div>
    </div>
  );
}