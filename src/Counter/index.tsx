import { h, VNode } from "preact";
import { useState } from "preact/hooks";
import register from "preact-custom-element";
import styles from "./Counter.module.css";

interface BubbleProperties {
  name?: string;
}
interface CounterProps {
  properties?: BubbleProperties;
}

export default function Index(props: CounterProps): VNode {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.card}>
      <h1>Hi {props.properties?.name ?? "anonymous"}.</h1>
      <div>
        This counter is written fully in Preact. This element can also load
        properties from Bubble.io
        <br />
        The current count is: {count}
      </div>
      <button onClick={() => setCount(count + 10)}>Plus 10</button>
      <button onClick={() => setCount(count - 1)}>Minus</button>
    </div>
  );
}

register(Index, "custom-counter", ["properties"]);
