import { useRef } from "react";

export function useUniqueKey(startingNumber = 0) {
    const uniqueKey = useRef(startingNumber);

    function getUniqueKey() {
        uniqueKey.current++;
        console.log(uniqueKey.current);

        return uniqueKey.current;
    }

    return getUniqueKey;
}
