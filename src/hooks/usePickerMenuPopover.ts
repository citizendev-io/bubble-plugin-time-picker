import { flip } from "@floating-ui/core";
import {
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useEffect, useState } from "preact/hooks";
import { TimePickerProps } from "../TimePicker/TimePicker";
import { useBindHandlersToRef } from "./useBindHandlersToRef";
import { useBubbleCanvasRef } from "./useBubbleCanvasRef";

type UsePickerMenuPopoverProps = {
  rootProps: TimePickerProps;
  onOpen?: () => void;
  onClose?: () => void;
};
export const usePickerMenuPopover = ({
  onClose,
  onOpen,
  rootProps,
}: UsePickerMenuPopoverProps) => {
  const canvasRef = useBubbleCanvasRef(rootProps);

  const [isOpen, setIsOpen] = useState(false);
  const handleSetOpen = (value: boolean) => {
    if (value) {
      onOpen?.();
      setIsOpen(true);
    } else {
      onClose?.();
      setIsOpen(false);
    }
  };
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

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  useBindHandlersToRef(canvasRef, getReferenceProps);

  return { isOpen, refs, floatingStyles, getFloatingProps, setIsOpen };
};
