import { useEffect, useState } from "preact/hooks";

export function useBubbleState<
  F,
  S,
  E extends string,
  N extends keyof S,
  V extends S[N],
>(
  props: Bubble.Element.ElementProps<F, S, E>,
  stateName: N,
  initialValue: V,
): [V, (a: V) => void] {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    if (props.instance && props.properties) {
      props.instance.publishState(stateName, initialValue);
    }
  }, [initialValue, props.instance, props.properties]);

  const wrappedSetState = (value: V) => {
    props.instance?.publishState(stateName, value);
    setState(value);
  };

  return [state, wrappedSetState];
}
