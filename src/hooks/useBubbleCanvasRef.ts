import { MutableRef, useEffect, useRef } from "preact/hooks";

export function useBubbleCanvasRef<F, S, E extends string>(
  props: Bubble.Element.ElementProps<F, S, E>,
): MutableRef<HTMLElement | undefined> {
  const ref = useRef<HTMLElement>();
  useEffect(() => {
    if (props.instance) {
      const canvas = props.instance.canvas;
      ref.current = canvas[0];
    }
  }, [props.instance]);

  return ref;
}
