import { tryExtractErrors } from "@/modules/errorsHandling";
import { ExtractedErrors, ObjectWithPotentialError } from "@/types/types";
import { useState } from "react";

export function useHandleRequest<T>() {
    const [errors, setErrors] = useState<ExtractedErrors | undefined>();
    const [fetchingState, setFetchingState] = useState<T | false>(false);

    async function handleResponse(response: Response) {
        if (!response.ok) {
            try {
                const result = await response.json();
                const errors = tryExtractErrors(result);

                setErrors(errors);
            } catch (e) {
                console.error(e);
            } finally {
                setFetchingState(false);
            }

            return false;
        }

        setErrors(undefined);
        return await response.json();
    }

    return {
        errors,
        fetchingState,
        setFetchingState,
        handleResponse,
    };
}
