
export interface TimeRemaining {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  minutesInDay: number; // Total minutes remaining in the current day cycle (0-1439)
  seconds: number;
  totalMs: number;
}

export interface DateConfig {
  endDate: string;
}
