import React, { useEffect, useRef } from "react";
import styles from "./foundPerson.module.scss";
import { PersonFromAPI } from "@/types/types";

export default function AutocompleteBarOption({
    person,
    selected,
    setPicked,
}: {
    person: { person: PersonFromAPI; personString: string };
    selected?: boolean;
    setPicked: (person: PersonFromAPI) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selected) {
            ref.current?.scrollIntoView({ block: "nearest" });
        }
    }, [selected]);

    let className = styles["autocomplete-option"];
    className += selected ? ` ${styles["autocomplete-option--selected"]}` : "";

    return (
        <div
            className={className}
            ref={ref}
            onClick={() => {
                setPicked(person.person);
            }}
        >
            <span>{person.personString}</span>
            <input type="hidden" name="track" value={person.person._id} />
        </div>
    );
}
