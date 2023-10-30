import { addDays } from "./../src/helpers";
import { describe, expect, it } from "vitest";
import { summary } from "../src/summary";
import {
  differenceInDays,
  relativeDates,
  startOfDay,
  subDays,
} from "../src/helpers";
import dayjs, { Dayjs } from "dayjs";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

describe("summury rewrite", () => {
  it("should report a summary of streaks", () => {
    var today = startOfDay(new Date());
    var result = summary([
      new Date(today),
      new Date(subDays(today, 1)),
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      new Date("01/03/2018"),
    ]);

    expect(result.currentStreak).toEqual(2);
    expect(result.longestStreak).toEqual(3);
    expect(result.streaks[0]).toEqual(3);
    expect(result.streaks[1]).toEqual(2);
    // expect(result.todayInStreak).toEqual(true);
    // expect(result.withinCurrentStreak).toEqual(true);
  });

  it("it should support unsorted dates", () => {
    var longStreak = summary([
      new Date("08/19/2018"),
      new Date("08/18/2018"),
      new Date("08/13/2018"),
      new Date("08/17/2018"),
      new Date("08/15/2018"),
      new Date("08/14/2018"),
      new Date("08/12/2018"),
      new Date("08/11/2018"),
      new Date("08/16/2018"),
      new Date("08/10/2018"),
      new Date("08/09/2018"),
    ]);
    // expect(longStreak.currentStreak).toStrictEqual(0);
    expect(longStreak.streaks).toStrictEqual([11]);
  });

  it("it should return an array of streaks", () => {
    const streak = summary([
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      new Date("01/03/2018"),
      new Date("01/04/2018"),
      // skipped 05
      new Date("01/06/2018"),
      new Date("01/07/2018"),
    ]);

    const continousStreak = summary([
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      new Date("01/03/2018"),
      new Date("01/04/2018"),
    ]);

    expect(streak.streaks).toStrictEqual([4, 2]);
    expect(continousStreak.streaks).toStrictEqual([4]);
  });

  it("it should calculate the current streak correctly", () => {
    const notACurrentStreak = summary([
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      new Date("01/03/2018"),
      new Date("01/04/2018"),
    ]);
    expect(notACurrentStreak.currentStreak).toBe(0);

    const { today, yesterday } = relativeDates();

    const aCurrentStreak = summary([
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      today,
      yesterday,
    ]);
    expect(aCurrentStreak.currentStreak).toBe(2);
  });

  it("should correctly handle future days in streak counting", () => {
    const { today, tomorrow, yesterday } = relativeDates();

    const doesNotIncludeFutureDays = summary(
      [
        new Date("10/11/2018"),
        new Date("10/10/2018"),
        yesterday,
        today,
        // future below would not be counted
        tomorrow,
        addDays(tomorrow, 1) as unknown as Date,
        addDays(tomorrow, 2) as unknown as Date,
        addDays(tomorrow, 3) as unknown as Date,
      ],
      (first, last) => {
        const result = differenceInDays(last, first);
        const isInTheFuture = differenceInDays(today, last) < 0;
        return {
          shouldIncrement: result === 1 && !isInTheFuture,
          shouldSkip: result !== 1 && result !== 0 && !isInTheFuture,
        };
      }
    );
    expect(doesNotIncludeFutureDays.streaks).toStrictEqual([2, 2]);
  });

  it("should accept a callback function", () => {
    const summaryWithoutCallaback = summary([
      new Date("01/01/2018"),
      new Date("01/02/2018"),
      new Date("01/03/2018"),
      new Date("01/04/2018"),
    ]);
    const summaryWithCallaback = summary(
      [
        new Date("01/01/2018"),
        new Date("01/02/2018"),
        new Date("01/03/2018"),
        new Date("01/04/2018"),
      ],
      (first, last) => {
        const result = differenceInDays(last, first);
        return {
          shouldIncrement: result === 1,
          shouldSkip: result !== 1 && result !== 0,
        };
      }
    );
    expect(summaryWithCallaback.streaks).toStrictEqual(
      summaryWithoutCallaback.streaks
    );
  });

  it("it should work customizable with callbacks", () => {
    const dates: Record<string, "checked" | "skipped"> = {
      "01/01/2018": "checked",
      "01/02/2018": "checked",
      "01/03/2018": "checked",
      "01/04/2018": "skipped",
      "01/05/2018": "skipped",
      "01/06/2018": "checked",
      "01/10/2018": "skipped",
      "01/11/2018": "checked",
    };

    const __ = summary(
      [
        new Date("01/01/2018"),
        // Day 2 is missing but it did not break the sreak
        new Date("01/03/2018"),
        new Date("01/10/2018"),
        new Date("01/11/2018"),
      ],
      (first, last) => {
        const result = differenceInDays(last, first);

        return {
          shouldIncrement: result === 2 || result === 1,
          shouldSkip: result > 2 && result !== 0,
        };
      }
    );

    console.log(__);
    expect(__.streaks).toStrictEqual([2, 2]);

    const onlyBreakStreakWhenTwoDaysAreMissing = summary(
      [
        new Date("01/01/2018"),
        new Date("01/02/2018"),
        new Date("01/03/2018"),
        new Date("01/04/2018"),
        new Date("01/05/2018"),
        new Date("01/06/2018"),
        new Date("01/10/2018"),
        new Date("01/11/2018"),
      ],
      (first, last) => {
        const result = differenceInDays(last, first);

        const date = dayjs(first).format("MM/DD/YYYY");

        const shouldIncrement = result === 1 && dates[date] === "checked";
        const shouldSkip = result !== 1 && result !== 0;

        return {
          shouldIncrement,
          shouldSkip,
        };
      }
    );

    expect(onlyBreakStreakWhenTwoDaysAreMissing.streaks).toStrictEqual([4, 1]);
  });
});
