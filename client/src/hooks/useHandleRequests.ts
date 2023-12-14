import { tryExtractErrors } from "@/modules/errorsHandling";
import { ExtractedErrors, ObjectWithPotentialError } from "@/types/types";
import { useCallback, useState } from "react";

export function useHandleRequest<T>(fetchingDefault: T | false = false) {
    const [errors, setErrors] = useState<ExtractedErrors | undefined>();
    const [errorsKey, setErrorsKey] = useState(new Date().toUTCString());
    const [fetchingState, setFetchingState] = useState<T | false>(
        fetchingDefault
    );

    const handleResponse = useCallback(async function (response: Response) {
        if (!response.ok) {
            try {
                const result = await response.json();
                const errors = tryExtractErrors(result);

                setErrors(errors);
                setErrorsKey(new Date().toUTCString());
            } catch (e) {
                console.error(e);
            } finally {
                setFetchingState(false);
            }

            return false;
        }

        setErrors(undefined);
        return await response.json();
    }, []);

    return {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    };
}
