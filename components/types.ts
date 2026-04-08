export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type SavedNote = {
  id: string;
  dateKey: string;
  label: string;
  text: string;
  createdAt: number;
};