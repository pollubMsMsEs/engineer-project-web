import {
    ErrorObject,
    ExtractedErrors,
    ObjectWithPotentialError,
} from "@/types/types";
import { toast } from "react-toastify";

export function tryExtractErrors(
    objectWithPotentialError: ObjectWithPotentialError
): ExtractedErrors | undefined {
    if ("errors" in objectWithPotentialError) {
        return objectWithPotentialError.errors;
    } else if (
        "message" in objectWithPotentialError &&
        !objectWithPotentialError.acknowledged
    ) {
        return objectWithPotentialError.message;
    } else if ("error" in objectWithPotentialError) {
        return objectWithPotentialError.error;
    }
}

export function tryExtractErrorAsString(
    objectWithPotentialError: ObjectWithPotentialError
) {
    const errors = tryExtractErrors(objectWithPotentialError);
    if (!errors) return;

    if (Array.isArray(errors)) {
        const { type, msg, path } = errors[0];
        return `${type === "field" ? path + ": " : ""}${msg}`;
    } else {
        return errors;
    }
}

export async function handleResponseErrorWithToast(response: Response) {
    let error = "Unknown error";

    try {
        const result = await response.json();
        error = tryExtractErrorAsString(result) ?? error;
    } catch (e) {
        console.log(e);
    }

    toast.error(error);
}
