import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, active: boolean, duration = 1800) {
    const [count, setCount] = useState(0);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!active || startedRef.current) return;
        startedRef.current = true;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const start = performance.now();

        const tick = (now: number) => {
            if (prefersReduced) {
                setCount(target);
                return;
            }
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(ease * target));
            if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [active, target, duration]);

    return count;
}
