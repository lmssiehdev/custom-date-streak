import dayjs, { Dayjs } from "dayjs";
import { SummaryParams } from "../summary_old";

export type ValidDate = string | number | Date | Dayjs;
export type AcceptedDateInput = ValidDate[] | { dates: ValidDate[] };

export const startOfDay = (date: ValidDate) =>
  dayjs(date).startOf("day").toDate();
export const subDays = (date: ValidDate, value: number) =>
  dayjs(date).subtract(value, "day").toDate();
export const addDays = (date: ValidDate, value: number) =>
  dayjs(date).add(value, "day").toDate();

export const endOfWeek = (date: ValidDate) => dayjs(date).endOf("week");
export const isValid = (date: ValidDate) => dayjs(date).isValid();

export const relativeDates = () => ({
  today: startOfDay(new Date()),
  yesterday: startOfDay(subDays(new Date(), 1)),
  tomorrow: startOfDay(addDays(new Date(), 1)),
});

export const differenceInDays = (later: Date, earlier: Date) => {
  const date = dayjs(later);
  return date.diff(earlier, "day");
};

export const filterInvalidDates = (dates: Date[]) =>
  dates.filter((date) =>
    !isValid(dayjs(date))
      ? console.error(
          `The date '${date}' is not in a valid date format and date-streaks is ignoring it.`
        )
      : new Date(date)
  );

export const sortDates = (dates: Date[]) => {
  return dates
    .sort(function (a, b) {
      //! unsafe
      // @ts-expect-error
      return startOfDay(b) - startOfDay(a);
    })
    .reverse();
};

export const getDatesParameter = (param: SummaryParams) => {
  if (Array.isArray(param)) {
    return param;
  } else {
    const { dates } = param;
    return dates || [];
  }
};
