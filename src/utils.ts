import dayjs, { Dayjs } from "dayjs";
import { AMPM } from "./types/date";

export function padTimeNumber(number: number): string {
  return number.toString().padStart(2, "0");
}

export function timeFromComponent(
  hour: number,
  minute: number,
  second: number,
  ampm: AMPM | null,
): Dayjs {
  // 12:00PM = 12:00
  // 12:00AM = 00:00
  if (ampm === "PM" && hour < 12) {
    hour += 12;
  } else if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  return dayjs().set("hour", hour).set("minute", minute).set("second", second);
}

export function componentFromTime(
  time: Dayjs,
  use12Hour: boolean,
): { hour: number; minute: number; second: number; ampm: AMPM | null } {
  const hour = use12Hour ? parseInt(time.format("h")) || 0 : time.hour();
  const minute = time.minute();
  const second = time.second();
  const ampm = use12Hour
    ? (time.format("A").toUpperCase() as AMPM) ?? "AM"
    : null;
  return {
    hour,
    minute,
    second,
    ampm,
  };
}
