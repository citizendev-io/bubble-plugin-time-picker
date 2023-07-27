import c from "classnames";
import _ from "lodash";
import { useEffect, useRef } from "preact/hooks";
import classNames from "./PickerMenu.module.css";

interface ChoiceListProps<T> {
  choices: T[];
  value: T;
  onChange: (val: T) => void;
  formatChoice?: (val: T) => string;
}
function calculateMiddleLine(element: HTMLElement) {
  const boundingRect = element.getBoundingClientRect();
  return (boundingRect.bottom - boundingRect.top) / 2 + boundingRect.top;
}
function ChoiceList<T>({
  choices,
  value,
  onChange,
  formatChoice,
}: ChoiceListProps<T>) {
  const formatter = formatChoice || ((val: T) => `${val}`);
  const containerRef = useRef<HTMLUListElement>(null);
  const handleContainerScroll = () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const containerMiddleLine = calculateMiddleLine(container);

    [...container.children].forEach(function (ele: HTMLElement, index: number) {
      const elementMiddleLine = calculateMiddleLine(ele);
      if (Math.abs(elementMiddleLine - containerMiddleLine) > 10) {
        return;
      }
      onChange(choices[index]);
    });
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const index = choices.indexOf(value);
    if (index > 0) {
      container.children.item(index)?.scrollIntoView({ block: "nearest" });
    }

    const scrollHandler = _.debounce(handleContainerScroll, 100);
    container.addEventListener("scroll", scrollHandler, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return (
    <ul className={classNames.numberColumn} ref={containerRef}>
      {choices.map((choice) => (
        <li
          className={c({
            [classNames.selected]: value === choice,
            [classNames.numberLine]: true,
          })}
          onClick={(event) => {
            onChange(choice);
            event.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }}
        >
          {formatter(choice)}
        </li>
      ))}
    </ul>
  );
}

export default ChoiceList;
