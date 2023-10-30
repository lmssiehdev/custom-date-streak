import { useEffect, useMemo, useState } from "react";
import { useMonth } from "../hooks/use-month-navigation";
import dayjs, { Dayjs } from "dayjs";
import { summary } from "../../../src/summary";
import {
  addDays,
  differenceInDays,
  relativeDates,
  type ValidDate,
} from "../../../src/helpers";
const formatDate = (date: ValidDate) => dayjs(date).format("YYYY-M-D");
const { yesterday, tomorrow, today } = relativeDates();

const dates: Record<string, "checked" | "skipped"> = {
  [formatDate(yesterday)]: "checked",
  [formatDate(today)]: "checked",
  [formatDate(tomorrow)]: "checked",
  [formatDate(addDays(tomorrow, 1))]: "checked",
  [formatDate(addDays(tomorrow, 2))]: "checked",
  [formatDate(addDays(tomorrow, 3))]: "checked",
};

export default function Calendar() {
  const {
    currentYear,
    currentMonth,
    goToNextMonth,
    goToPrevMonth,
    isCurrentMonth,
    startOffset,
    daysInMonth,
  } = useMonth();

  const [datesInStreak, setDatesInStreak] = useState<
    Record<string, "checked" | "skipped">
  >(() => dates);

  function addStreak(date: Date) {
    if (!(date instanceof Date)) return;

    if (datesInStreak[formatDate(date)] === "skipped") {
      delete datesInStreak[formatDate(date)];
      setDatesInStreak({ ...datesInStreak });
      return;
    }
    if (datesInStreak[formatDate(date)] === "checked") {
      datesInStreak[formatDate(date)] = "skipped";
      setDatesInStreak({ ...datesInStreak });
      return;
    }

    setDatesInStreak({ ...datesInStreak, [formatDate(date)]: "checked" });
  }

  const result = useMemo(
    () =>
      summary(
        Object.keys(datesInStreak).map((date) => dayjs(date).toDate()),
        (first, last) => {
          const result = differenceInDays(last, first);

          const date = formatDate(dayjs(first));

          const shouldIncrement =
            result === 1 && datesInStreak[date] === "checked";
          const shouldSkip = result !== 1 && result !== 0;

          return {
            shouldIncrement,
            shouldSkip,
          };
        }
      ),
    [datesInStreak]
  );

  return (
    <div className="flex justify-between">
      <div className="max-w-sm w-full">
        <div>
          {/* <label>
            include future Days
            <input
              type="checkbox"
              checked={includeFutureDays}
              onChange={({ target }) => {
                setIncludeFutureDays(target.checked);
              }}`
            ></input>
          </label> */}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <button onClick={goToPrevMonth}>prev</button>
          Calendar
          <button
            className="disabled:opacity-10"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
          >
            next
          </button>
        </div>
        <MonthlyView
          startOffset={startOffset}
          daysInMonth={daysInMonth}
          date={{ year: currentYear, month: currentMonth }}
          dates={datesInStreak}
          datePress={addStreak}
        />
      </div>
    </div>
  );
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function MonthlyView({
  startOffset,
  daysInMonth,
  date,
  datePress,
  dates,
}: {
  startOffset: number;
  daysInMonth: number;
  date: {
    year: number;
    month: number;
  };
  dates: string[];
  datePress: (date: Date) => void;
}) {
  return (
    <div className="">
      <div className=" grid grid-cols-7 grid-rows-7 children:aspect-square children:h-12 gap-3">
        {days.map((day) => (
          <div key={day} className=" flex justify-center items-center opaci ">
            {day.substr(0, 2)}
          </div>
        ))}
        {[...Array(startOffset)].map((e, index) => {
          return <div key={index}></div>;
        })}
        {[...Array(daysInMonth)].map((day, index) => {
          const formatedDate = formatDate(
            `${date.month + 1}-${index + 1}-${date.year}`
          );
          dayjs().format("YYYY-M-D");
          // const formatedDate = dateJS.format("YYYY-M-D");
          return (
            <button
              className="flex justify-center"
              style={{
                backgroundColor: dates[formatedDate as keyof typeof dates]
                  ? "crimson"
                  : "",
                opacity:
                  dates[formatedDate as keyof typeof dates] === "skipped"
                    ? 0.4
                    : 1,
              }}
              key={day}
              title={formatedDate}
              onClick={() => datePress(new Date(formatedDate))}
            >
              {index + 1}
              {/* <Day
                size="full"
                status={habit.completedDates[formatedDate]}
                color={habit.color}
                isActiveDay={habit.frequency[dateJS.day()]}
                onClick={() => {
                  markHabit(habit.id, formatedDate);
                }}
              /> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
