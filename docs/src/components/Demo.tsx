import { useCallback, useMemo, useState } from "react";
import { summary } from "../../../src/summary";
import { addDays } from "../../../src/helpers";

export function Result() {
  const today = new Date();
  const [includeFutureDays, setIncludeFutureDays] = useState(false);

  const result = useMemo(
    () =>
      summary(
        [
          new Date("10/10/2020"),
          new Date("10/11/2020"),
          today,
          addDays(today, 1),
          addDays(today, 2),
          addDays(today, 3),
          addDays(today, 4),
        ],
        undefined,
        includeFutureDays
      ),
    [includeFutureDays]
  );

  return (
    <div>
      <label>
        include future Days
        <input
          type="checkbox"
          checked={includeFutureDays}
          onChange={({ target }) => {
            setIncludeFutureDays(target.checked);
          }}
        ></input>
      </label>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
