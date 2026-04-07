# Interactive Calendar Component

A polished wall-calendar React/Next.js component with date range selection, per-range notes, and month-adaptive theming.

## Features

- **Full-date range selection** — ranges work correctly across month boundaries (stores `Date` objects, not bare day numbers)
- **Hover preview** — hovering shows a preview of the selected range before confirming end date
- **Today marker** — subtle accent dot on today's date
- **Month-adaptive theming** — background gradient, hero image, and accent color all shift per month
- **Per-range notes** — notes are saved and keyed to their specific date range via `localStorage`
- **Saved notes list** — expandable list of all saved notes with delete support
- **Page-flip animation** — smooth transition when navigating months
- **Fully responsive** — stacks vertically on mobile, side-by-side on desktop
- **Calendar binding holes** — decorative detail on the hero panel

## Tech

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- `next/image` for optimised hero images

## File Structure

```
components/
  CalendarGrid.tsx   — Calendar grid with range selection & hover preview
  HeroPanel.tsx      — Dynamic hero image per month
  NotesPanel.tsx     — Notes with per-range localStorage persistence
  types.ts           — DateRange and SavedNote types
  utils.ts           — Date comparison helpers

page.tsx             — Root layout with shared state
```

## Key Design Decisions

- **`currentDate` lifted to `page.tsx`** so the hero image and calendar always stay in sync
- **Full `Date` objects in `DateRange`** instead of bare numbers — prevents cross-month range bugs
- **`formatRangeLabel`** used as the localStorage key so notes are correctly associated with their range
- **Month themes** defined as lookup tables — easy to extend or customise

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).