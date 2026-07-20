// weekdays are 0 = Sunday … 6 = Saturday (date-fns getDay()); displayed Monday-first
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const LABELS: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

export function formatWeekdays(weekdays: number[]): string {
  const sorted = [...weekdays].sort(
    (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b),
  );

  const runs: number[][] = [];
  for (const day of sorted) {
    const currentRun = runs[runs.length - 1];
    const previousDay = currentRun?.[currentRun.length - 1];
    const isContiguous =
      previousDay !== undefined &&
      WEEK_ORDER.indexOf(day) === WEEK_ORDER.indexOf(previousDay) + 1;

    if (currentRun && isContiguous) {
      currentRun.push(day);
    } else {
      runs.push([day]);
    }
  }

  return runs
    .map((run) =>
      run.length === 1
        ? LABELS[run[0]]
        : `${LABELS[run[0]]}-${LABELS[run[run.length - 1]]}`,
    )
    .join(", ");
}
