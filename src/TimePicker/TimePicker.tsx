import { FloatingPortal } from "@floating-ui/react";
import dayjs from "dayjs";
import * as _ from "lodash-es";
import register from "preact-custom-element";
import { useEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import { useBubbleState } from "../hooks/useBubbleState";
import useDefineBubbleAction from "../hooks/useDefineBubbleAction";
import { usePickerMenuPopover } from "../hooks/usePickerMenuPopover";
import { nullClamp } from "../utils";
import PickerMenu from "./PickerMenu";
import classNames from "./TimePicker.module.css";

interface TimePickerStates {
  hour: number;
  minute: number;
  second: number;
}

interface TimePickerFields {
  placeholder: string;
  use12Hour: boolean;
  showSecond: boolean;
  initialHour: number;
  initialMinute: number;
  initialSecond: number;
  minuteStep: number;
  secondStep: number;
}

type TimePickerEvents = "change" | "focused";

export type TimePickerProps = Bubble.Element.ElementProps<
  TimePickerFields,
  TimePickerStates,
  TimePickerEvents
>;

const TimePicker: React.FC<TimePickerProps> = (props) => {
  const { properties } = props;

  const initialHour = nullClamp(properties?.initialHour, 0, 24);
  const initialMinute = nullClamp(properties?.initialMinute, 0, 60);
  const initialSecond = nullClamp(properties?.initialSecond ?? 0, 0, 60);

  const [, setHour] = useBubbleState(props, "hour", initialHour);
  const [, setMinute] = useBubbleState(props, "minute", initialMinute);
  const [, setSecond] = useBubbleState(props, "second", initialSecond);

  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs>();

  useEffect(() => {
    if (!_.isNil(initialHour) && !_.isNil(initialMinute)) {
      setSelectedTime(
        dayjs()
          .set("hour", initialHour!)
          .set("minute", initialMinute!)
          .set("second", initialSecond ?? 0),
      );
    }
  }, [initialHour, initialMinute, initialSecond]);

  useDefineBubbleAction<{ hour: number; minute: number; second: number }>(
    props,
    "setTime",
    (actionProperties) => {
      const newTime = dayjs()
        .set("hour", actionProperties.hour)
        .set("minute", actionProperties.minute)
        .set("second", actionProperties.second ?? 0);
      setSelectedTime(newTime);
      commitTime();
    },
  );

  const commitTime = () => {
    setIsOpen(false);
    if (!selectedTime) {
      return;
    }
    const newHour = selectedTime.hour();
    const newMinute = selectedTime.minute();
    const newSecond = selectedTime.second();
    setHour(newHour);
    setMinute(newMinute);
    setSecond(newSecond);
  };

  const timeString = useMemo(() => {
    if (!selectedTime) {
      return "";
    }
    const showSeconds = properties?.showSecond ?? false;
    const use12Hour = properties?.use12Hour ?? false;
    let format;

    if (use12Hour) {
      if (showSeconds) {
        format = "hh:mm:ss A";
      } else {
        format = "hh:mm A";
      }
    } else {
      if (showSeconds) {
        format = "HH:mm:ss";
      } else {
        format = "HH:mm";
      }
    }

    return selectedTime.format(format);
  }, [selectedTime, properties?.showSecond, properties?.use12Hour]);

  const { isOpen, refs, floatingStyles, getFloatingProps, setIsOpen } =
    usePickerMenuPopover({ rootProps: props, onClose: commitTime });

  return (
    <>
      <div className={classNames.input}>
        <div className={classNames.timeString}>
          {timeString || properties?.placeholder}
        </div>
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={classNames.menu}
            {...getFloatingProps()}
          >
            <PickerMenu
              minuteStep={properties?.minuteStep}
              secondStep={properties?.secondStep}
              time={selectedTime ?? dayjs.unix(0)}
              use12Hours={properties?.use12Hour}
              showSecond={properties?.showSecond}
              onChange={setSelectedTime}
              onConfirm={commitTime}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default TimePicker;

register(TimePicker, "custom-time-picker", [
  "properties",
  "instance",
  "context",
]);
