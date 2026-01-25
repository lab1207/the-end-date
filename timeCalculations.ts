
import { TimeRemaining, DateConfig } from '../types';

export const calculateRemaining = (config: DateConfig, fromDate: Date = new Date()): TimeRemaining => {
  const targetDate = new Date(config.endDate);
  // Ensure we treat the end date as the end of that day (23:59:59) for a full day count
  targetDate.setHours(23, 59, 59, 999);
  
  const diff = targetDate.getTime() - fromDate.getTime();
  const safeDiff = Math.max(0, diff);
  
  const msPerMinute = 1000 * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerYear = msPerDay * 365.25;

  // Hierarchical Breakdown
  // A: Years (Total remaining years)
  const years = Math.floor(safeDiff / msPerYear);
  
  // B: Days (Days remaining in the current partial year)
  // This ensures that when days > 365, they roll into years
  const days = Math.floor((safeDiff % msPerYear) / msPerDay);

  // C: Hours (Hours remaining in the current partial day)
  // This ensures that when hours > 24, they roll into days
  const hours = Math.floor((safeDiff % msPerDay) / msPerHour);

  // D: Total Minutes in current 24h block
  const minutesInDay = Math.floor((safeDiff % msPerDay) / msPerMinute);
  
  const minutes = Math.floor((safeDiff % msPerHour) / msPerMinute);
  const seconds = Math.floor((safeDiff % msPerMinute) / 1000);

  return {
    years,
    days,
    hours,
    minutes,
    minutesInDay,
    seconds,
    totalMs: safeDiff
  };
};

export const getRingPercentages = (remaining: TimeRemaining) => {
  // Ring A: Years (e.g. progress within a 10-year span for visual scale)
  // Ring B: Days (progress through a 365-day year)
  // Ring C: Hours (progress through a 24-hour day)
  // Ring D: Minutes (progress through 1440 minutes of a full day)
  
  return {
    years: Math.min((remaining.years / 10) * 100, 100),
    days: (remaining.days / 365) * 100,
    hours: (remaining.hours / 24) * 100,
    minutesInDay: (remaining.minutesInDay / 1440) * 100
  };
};
