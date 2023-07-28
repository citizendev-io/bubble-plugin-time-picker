import { FloatingPortal } from "@floating-ui/react";
import dayjs from "dayjs";
import _ from "lodash";
import { VNode } from "preact";
import register from "preact-custom-element";
import { useEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useBubbleState } from "../hooks/useBubbleState";
import { usePickerMenuPopover } from "../hooks/usePickerMenuPopover";
import PickerMenu from "./PickerMenu";
import classNames from "./TimePicker.module.css";

interface TimePickerStates {
  hour: number;
  minute: number;
  second: number;
}

interface TimePickerFields {
  use12Hour: boolean;
  showSecond: boolean;
  initialHour: number;
  initialMinute: number;
  initialSecond: number;
}

type TimePickerEvents = "change" | "focused";

export type TimePickerProps = Bubble.Element.ElementProps<
  TimePickerFields,
  TimePickerStates,
  TimePickerEvents
>;

export default function TimePicker(props: TimePickerProps): VNode {
  const { properties } = props;
  const initialHour = _.clamp(properties?.initialHour ?? 0, 0, 24);
  const initialMinute = _.clamp(properties?.initialMinute ?? 0, 0, 60);
  const initialSecond = _.clamp(properties?.initialSecond ?? 0, 0, 60);

  const [, setHour] = useBubbleState(props, "hour", initialHour);
  const [, setMinute] = useBubbleState(props, "minute", initialMinute);
  const [, setSecond] = useBubbleState(props, "second", initialSecond);

  const [selectedTime, setSelectedTime] = useState(dayjs());

  useEffect(() => {
    setSelectedTime(
      dayjs()
        .set("hour", initialHour)
        .set("minute", initialMinute)
        .set("second", initialSecond),
    );
  }, [initialHour, initialMinute, initialSecond]);

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
    let format = "";

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
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className={classNames.input}>
        <div className={classNames.timeString}>{timeString}</div>
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
              time={selectedTime}
              use12Hours={properties?.use12Hour}
              showSecond={properties?.showSecond}
              onChange={setSelectedTime}
              onConfirm={commitTime}
            />
          </div>
        </FloatingPortal>
      )}
    </ErrorBoundary>
  );
}

register(TimePicker, "custom-time-picker", [
  "properties",
  "instance",
  "context",
]);
