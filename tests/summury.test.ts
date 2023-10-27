import { describe, expect, it } from "vitest";
import { summary } from "../src/summary";
import { differenceInDays, startOfDay, subDays } from "../src/helpers";
import dayjs from "dayjs";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

describe("summury rewrite", () => {
  it("should report a summary of streaks", () => {
    var today = startOfDay(new Date());
    var result = summary([
      new Date(today),
      new Date(subDays(today, 1).toDate()),
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

  // temp tests
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
