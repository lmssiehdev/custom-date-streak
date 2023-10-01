import dayjs, { Dayjs } from "dayjs";
import { SummaryParams } from "./summary";

export type ValidDate = string | number | Date | Dayjs;
export type AcceptedDateInput = ValidDate[] | { dates: ValidDate[] };

export const startOfDay = (date: ValidDate) =>
  dayjs(date).startOf("day").toDate();
export const subDays = (date: ValidDate, value: number) =>
  dayjs(date).subtract(value, "day");
export const addDays = (date: ValidDate, value: number) =>
  dayjs(date).add(value, "day");

export const endOfWeek = (date: ValidDate) => dayjs(date).endOf("week");
export const isValid = (date: ValidDate) => dayjs(date).isValid();

export const relativeDates = () => ({
  today: startOfDay(new Date()),
  yesterday: startOfDay(subDays(new Date(), 1)),
  tomorrow: startOfDay(addDays(new Date(), 1)),
});

export const filterInvalidDates = (dates: ValidDate[]) =>
  dates.filter((date) =>
    !isValid(dayjs(date))
      ? console.error(
          `The date '${date}' is not in a valid date format and date-streaks is ignoring it. Browsers do not consistently support this and this package's results may fail. Verify the array of dates you're passing to date-streaks are all valid date strings. http://momentjs.com/docs/#/parsing/string/`
        )
      : dayjs(date)
  );

export const sortDates = (dates: ValidDate[]) => {
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
