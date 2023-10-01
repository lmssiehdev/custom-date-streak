import { describe, expect, it } from "vitest";
import { endOfWeek, startOfDay } from "../src/helpers";
import trackRecord from "../src/track-record";

describe("Track record", () => {
  it("should report a track record", () => {
    var today = startOfDay(new Date());
    var result = trackRecord({ dates: [today] });

    expect(result[today]).to.equal(true);
  });

  it("should take a custom length of days", () => {
    var result = trackRecord({ dates: [new Date("3/19/2018")], length: 10 });
    expect(Object.keys(result).length).to.equal(10);
  });

  it("should take a custom end date", () => {
    var today = startOfDay(new Date());
    var result = trackRecord({
      dates: [today],
      startDate: endOfWeek(new Date()),
    });
    expect(result[today]).to.equal(true);
  });

  it("should take a custom length of days and a custom end date", () => {
    var today = startOfDay(new Date());
    var result = trackRecord({
      dates: [today],
      length: 10,
      endDate: endOfWeek(new Date()),
    });
    expect(result[today]).to.equal(true);
  });

  it("should accept an empty array as input", () => {
    var result = trackRecord({ dates: [] });
    debugger;
    expect(Object.keys(result).length).to.equal(7);
  });
});
