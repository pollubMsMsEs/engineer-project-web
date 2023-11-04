import { toast } from "react-toastify";

export function tryExtractError(objectWithPotentialError: any) {
    if (objectWithPotentialError.errors) {
        const { type, msg, path } = objectWithPotentialError.errors[0];
        return `${type === "field" ? path + ": " : ""}${msg}`;
    } else if (objectWithPotentialError.message) {
        return `${objectWithPotentialError.message}`;
    } else if (objectWithPotentialError.error) {
        return `${objectWithPotentialError.error}`;
    }
}

export async function handleResponseErrorWithToast(response: Response) {
    let error = "Unknown error";

    try {
        const result = await response.json();
        error = tryExtractError(result) ?? error;
    } catch (e) {
        console.log(e);
    }

    toast.error(error);
}
