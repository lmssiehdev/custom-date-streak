import { differenceInDays, relativeDates, sortDates } from "./helpers";

export function summary(
  dateParams: Date[] = [],
  callback?: (...args: any[]) => {
    shouldIncrement: boolean;
    shouldSkip: boolean;
  }
) {
  const { today, yesterday } = relativeDates();
  const sortedDates = sortDates(dateParams);

  const result = sortedDates.reduce(
    (prev, curr, index) => {
      const firstDate = new Date(curr);
      const nextDate = dateParams[index + 1]
        ? new Date(dateParams[index + 1]!)
        : firstDate;

      const isToday = differenceInDays(firstDate, today) === 0;
      const isYesterday = differenceInDays(firstDate, yesterday) === 0;
      const isInFuture = differenceInDays(today, firstDate) < 0;

      const diff = differenceInDays(nextDate, firstDate);

      const currentStreak =
        isToday || isYesterday || isInFuture
          ? prev.streaks[prev.streaks.length - 1]!
          : 0;

      if (typeof callback !== "function") {
        if (diff === 0) {
          // if (isToday) {
          //   prev.todayInStreak = true;
          // }
        } else {
          diff === 1
            ? ++prev.streaks[prev.streaks.length - 1]
            : prev.streaks.push(1);
        }
      } else {
        const { shouldIncrement, shouldSkip } = callback(firstDate, nextDate);

        if (shouldIncrement) ++prev.streaks[prev.streaks.length - 1];
        if (shouldSkip) prev.streaks.push(1);
      }

      return {
        ...prev,
        currentStreak,
        longestStreak: Math.max(...prev.streaks),
        isInFuture,
        isYesterday,
        isToday,
      };
    },
    {
      currentStreak: 0,
      longestStreak: 0,
      streaks: [1],
      isInFuture: false,
      isYesterday: false,
      isToday: false,
      // withinCurrentStreak: false,
      // todayInStreak: false,
    }
  );

  const { isToday, isYesterday, isInFuture, ...rest } = result;

  return rest;
}
