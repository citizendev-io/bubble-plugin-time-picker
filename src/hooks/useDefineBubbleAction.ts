import { useEffect } from "preact/hooks";

export default function useDefineBubbleAction<T extends Record<string, any>>(
  props: Bubble.Element.ElementProps<any, any, any>,
  name: string,
  action: (properties: T) => void,
) {
  useEffect(() => {
    if (props.instance) {
      props.instance.data[name] = action;
    }
  }, [props.instance]);
}
