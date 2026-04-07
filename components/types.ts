export type DateRange = {
  start: Date | null;
  end: Date | null;
};
 
export type SavedNote = {
  id: string;
  rangeLabel: string;
  startDate: Date | null;
  endDate: Date | null;
  text: string;
  createdAt: number;
};
 