import _ from "lodash";
import { flip } from "@floating-ui/core";
import {
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
} from "@floating-ui/react";
import { VNode } from "preact";
import register from "preact-custom-element";
import { useEffect, useMemo, useState } from "preact/hooks";
import React from "react";
import { useBindHandlersToRef } from "../hooks/useBindHandlersToRef";
import { useBubbleCanvasRef } from "../hooks/useBubbleCanvasRef";
import { useBubbleState } from "../hooks/useBubbleState";
import { padTimeNumber, TimeOfDay } from "../utils";
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

type TimePickerProps = Bubble.Element.ElementProps<
  TimePickerFields,
  TimePickerStates,
  TimePickerEvents
>;

export default function TimePicker(props: TimePickerProps): VNode {
  const [hour, setHour] = useBubbleState(
    props,
    "hour",
    _.clamp(props.properties?.initialHour ?? 0, 0, 24),
  );
  const [minute, setMinute] = useBubbleState(
    props,
    "minute",
    _.clamp(props.properties?.initialMinute ?? 0, 0, 60),
  );
  const [second, setSecond] = useBubbleState(
    props,
    "second",
    _.clamp(props.properties?.initialSecond ?? 0, 0, 60),
  );

  const [selectedTime, setSelectedTime] = useState<TimeOfDay>(new TimeOfDay());
  useEffect(() => {
    const initialHour = props.properties?.initialHour ?? 0;
    const initialMinute = props.properties?.initialMinute ?? 0;
    const initialSecond = props.properties?.initialSecond ?? 0;
    const ampm = props.properties?.use12Hour
      ? initialHour > 12
        ? "PM"
        : "AM"
      : null;
    setSelectedTime(
      new TimeOfDay(initialHour, initialMinute, initialSecond, ampm),
    );
  }, [props.properties]);
  const [isOpen, setIsOpen] = useState(false);
  const properties = { ...props.properties };
  useEffect(() => {
    if (properties.use12Hour) {
      setSelectedTime(new TimeOfDay(0, 0, 0, "AM"));
    }
  }, [properties.use12Hour]);

  const commitTime = () => {
    setIsOpen(false);
    if (!selectedTime) {
      return;
    }
    setHour(selectedTime.hour);
    setMinute(selectedTime.minute);
    setSecond(selectedTime.second);
  };

  const handleSetOpen = (value: boolean) => {
    if (value) {
      setIsOpen(true);
    } else {
      commitTime();
    }
  };

  const canvasRef = useBubbleCanvasRef(props);

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    middleware: [offset({ mainAxis: 20 }), flip()],
    open: isOpen,
    onOpenChange: handleSetOpen,
  });

  useEffect(() => {
    if (canvasRef.current) {
      refs.setReference(canvasRef.current);
    }
  }, [canvasRef.current]);

  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    focus,
    dismiss,
  ]);

  useBindHandlersToRef(canvasRef, getReferenceProps);

  const timeString = useMemo(() => {
    if (!selectedTime) {
      return "";
    }
    const showSeconds = properties?.showSecond ?? false;
    const use12Hour = properties?.use12Hour ?? false;
    let result = `${padTimeNumber(selectedTime._hour)}:${padTimeNumber(
      selectedTime._minute,
    )}`;

    if (showSeconds) {
      result += ":" + padTimeNumber(selectedTime._second);
    }
    if (use12Hour) {
      result += " " + selectedTime._ampm || "";
    }
    return result;
  }, [selectedTime, properties?.showSecond, properties?.use12Hour]);

  return (
    <>
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
    </>
  );
}

register(TimePicker, "custom-time-picker", [
  "properties",
  "instance",
  "context",
]);
