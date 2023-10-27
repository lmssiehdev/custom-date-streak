import {
  differenceInDays,
  getDatesParameter,
  filterInvalidDates,
  sortDates,
  relativeDates,
  ValidDate,
} from "./src/helpers";
import dayjs from "dayjs";

export type SummaryParams =
  | Date[]
  | {
      dates: Date[];
    };

function summary(datesParam = []) {
  const dates = getDatesParameter(datesParam);
  const { today, yesterday } = relativeDates();
  const allDates = filterInvalidDates(dates);
  const sortedDates = sortDates(allDates);

  const result = sortedDates.reduce(
    (acc, date, index) => {
      const first = dayjs(date);
      const second = sortedDates[index + 1]
        ? dayjs(sortedDates[index + 1])
        : first;
      const diff = differenceInDays(second, first);
      const isToday = acc.isToday || differenceInDays(date, today) === 0;
      const isYesterday =
        acc.isYesterday || differenceInDays(date, yesterday) === 0;
      const isInFuture = acc.isInFuture || differenceInDays(today, date) < 0;

      if (diff === 0) {
        if (isToday) {
          acc.todayInStreak = true;
        }
      } else {
        diff === 1
          ? ++acc.streaks[acc.streaks.length - 1]
          : acc.streaks.push(1);
      }

      return {
        ...acc,
        longestStreak: Math.max(...acc.streaks),
        withinCurrentStreak:
          acc.isToday ||
          acc.isYesterday ||
          acc.isInFuture ||
          isToday ||
          isYesterday ||
          isInFuture,
        currentStreak:
          isToday || isYesterday || isInFuture
            ? acc.streaks[acc.streaks.length - 1]
            : 0,
        isInFuture,
        isYesterday,
        isToday,
      };
    },
    {
      currentStreak: 0,
      longestStreak: 0,
      streaks: [1],
      todayInStreak: false,
      withinCurrentStreak: false,
      isInFuture: false,
      isToday: false,
      isYesterday: false,
    }
  );

  const { isToday, isYesterday, isInFuture, ...rest } = result;

  return rest;
}

export default summary;
