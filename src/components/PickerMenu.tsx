import _ from "lodash";
import { useEffect, useMemo, useState } from "preact/hooks";
import { AMPM, padTimeNumber, TimeOfDay } from "../utils";
import ChoiceList from "./ChoiceList";
import classNames from "./PickerMenu.module.css";

interface PickerMenuProps {
  showSecond?: boolean;
  use12Hours?: boolean;
  time: TimeOfDay;
  onChange: (time: TimeOfDay) => void;
  onConfirm?: () => void;
}

export default function PickerMenu({
  time,
  onChange,
  onConfirm,
  use12Hours,
  showSecond,
}: PickerMenuProps) {
  const [hour, setHour] = useState(time._hour);
  const [minute, setMinute] = useState(time._minute);
  const [second, setSecond] = useState(time._second);
  const [ampm, setAMPM] = useState<AMPM>(time._ampm ?? "AM");

  useEffect(() => {
    onChange(new TimeOfDay(hour, minute, second, ampm));
  }, [hour, minute, second, ampm]);

  const hourRange = useMemo(() => {
    if (use12Hours) {
      return _.range(1, 13);
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
          choices={_.range(0, 60)}
          value={minute}
          onChange={setMinute}
          formatChoice={padTimeNumber}
        />
        {showSecond && (
          <ChoiceList
            choices={_.range(0, 60)}
            value={second}
            onChange={setSecond}
            formatChoice={padTimeNumber}
          />
        )}
        {use12Hours && (
          <ChoiceList<AMPM>
            choices={["AM", "PM"]}
            value={ampm}
            onChange={setAMPM}
          />
        )}
      </div>
    </div>
  );
}
