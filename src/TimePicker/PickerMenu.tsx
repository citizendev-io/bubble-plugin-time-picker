import { Dayjs } from "dayjs";
import * as _ from "lodash-es";
import { useEffect, useMemo, useState } from "preact/hooks";
import { AMPM } from "../types/date";
import { componentFromTime, padTimeNumber, timeFromComponent } from "../utils";
import ChoiceList from "./ChoiceList";
import classNames from "./PickerMenu.module.css";

interface PickerMenuProps {
  showSecond?: boolean;
  use12Hours?: boolean;
  time: Dayjs;
  onChange: (time: Dayjs) => void;
  onConfirm?: () => void;
  minuteStep?: number;
  secondStep?: number;
}

export default function PickerMenu({
  time,
  onChange,
  use12Hours,
  showSecond,
  minuteStep,
  secondStep,
}: PickerMenuProps) {
  const {
    hour: initialHour,
    second: initialSecond,
    minute: initialMinute,
    ampm: initialAMPM,
  } = componentFromTime(time, !!use12Hours);
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [second, setSecond] = useState(initialSecond);
  const [ampm, setAMPM] = useState(initialAMPM);

  useEffect(() => {
    const time = timeFromComponent(hour, minute, second, ampm);
    onChange(time);
  }, [hour, minute, second, ampm]);

  const hourRange = useMemo(() => {
    if (use12Hours) {
      return [12, ..._.range(1, 12)];
    }
    return _.range(0, 24);
  }, [use12Hours]);

  return (
    <div className={classNames.container}>
      <div className={classNames.choiceRow}>
        <ChoiceList
          choices={hourRange}
          value={hour}
          onChange={setHour}
          formatChoice={padTimeNumber}
        />
        <ChoiceList
          choices={_.range(0, 60, minuteStep ?? 1)}
          value={minute}
          onChange={setMinute}
          formatChoice={padTimeNumber}
        />
        {showSecond && (
          <ChoiceList
            choices={_.range(0, 60, secondStep ?? 1)}
            value={second}
            onChange={setSecond}
            formatChoice={padTimeNumber}
          />
        )}
        {use12Hours && (
          <ChoiceList<AMPM>
            choices={["AM", "PM"]}
            value={ampm!}
            onChange={setAMPM}
          />
        )}
      </div>
    </div>
  );
}
