import _ from "lodash";

export function padTimeNumber(number: number): string {
  return number.toString().padStart(2, "0");
}

export type AMPM = "AM" | "PM";

export class TimeOfDay {
  _hour: number = 0;
  _minute: number = 0;
  _second: number = 0;
  _ampm: AMPM | null;

  constructor(
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    ampm: AMPM | null = null,
  ) {
    this._hour = _.clamp(hour, 0, 24);
    this._minute = _.clamp(minute, 0, 60);
    this._second = _.clamp(second, 0, 60);
    this._ampm = ampm;
  }

  get hour() {
    if (this._ampm === "AM") {
      if (this._hour === 12) {
        return 0;
      }
      return this._hour;
    } else if (this._ampm === "PM") {
      if (this._hour === 12) {
        return 12;
      }
      return this._hour + 12;
    }
    return this._hour;
  }
  get minute() {
    return this._minute;
  }
  get second() {
    return this._second;
  }
}
