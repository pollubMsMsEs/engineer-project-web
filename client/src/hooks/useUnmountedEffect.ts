import { useEffect, useRef } from "react";

export function useUnmountedEffect(
    effect: React.EffectCallback,
    deps?: React.DependencyList | undefined
) {
    const didMount = useRef(false);

    useEffect(() => {
        didMount.current = false;
    }, []);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }

        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
