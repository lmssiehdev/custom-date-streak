import { describe, expect, it } from "vitest";

describe("Streak Ranges", () => {
  it("should report ranges of streaks", () => {
    var result = streakRanges({
      dates: [
        new Date("01/01/2018"),
        new Date("01/02/2018"),
        new Date("01/04/2018"),
      ],
      streaks: [2, 1],
    });

    expect(result[0].start.getTime()).to.equal(
      new Date("01/04/2018").getTime()
    );
    expect(result[0].end).to.equal(null);
    expect(result[0].duration).to.equal(1);
    expect(result[1].start.getTime()).to.equal(
      new Date("01/01/2018").getTime()
    );
    expect(result[1].end.getTime()).to.equal(new Date("01/02/2018").getTime());
    expect(result[1].duration).to.equal(2);
  });
});
