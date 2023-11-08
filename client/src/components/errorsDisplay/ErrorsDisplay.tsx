import { ExtractedErrors, ObjectWithPotentialError } from "@/types/types";
import styles from "./errorsDisplay.module.scss";
import { tryExtractErrors } from "@/modules/errorsHandling";

export default function ErrorsDisplay({
    errors,
}: {
    errors?: ExtractedErrors;
}) {
    if (!errors) return;

    let displayedErrors;

    if (typeof errors === "string") {
        displayedErrors = errors;
    } else {
        displayedErrors = errors.map((error) => (
            <div key={`${error.path ?? ""} ${error.msg}`}>
                {`${error.path ?? ""}: ${error.msg}`}
            </div>
        ));
    }

    return (
        <div key={errors.toString()} className={styles["errors-display"]}>
            {displayedErrors}
        </div>
    );
}
