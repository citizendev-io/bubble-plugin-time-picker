import _ from "lodash";
import { MutableRef, useEffect } from "preact/hooks";

type EventHandlers = {
  [name: string]: any;
};

export function useBindHandlersToRef(
  ref: MutableRef<HTMLElement | undefined>,
  eventHandlerGetter: () => EventHandlers,
) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const eventHandlers = eventHandlerGetter();
    const events = {};
    _.keys(eventHandlers).forEach((key: string) => {
      if (key.startsWith("on")) {
        const eventName = key.replace("on", "").toLowerCase();
        const handler = eventHandlers[key];
        events[eventName] = handler;
        ref.current?.addEventListener(eventName, handler);
      }
    });

    return () => {
      _.keys(events).forEach((eventName) => {
        ref.current?.removeEventListener(eventName, events[eventName]);
      });
    };
  }, [eventHandlerGetter, ref.current]);
}
