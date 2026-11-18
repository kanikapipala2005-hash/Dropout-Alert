import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) return;

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      valueRef.current = current;
      setValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
