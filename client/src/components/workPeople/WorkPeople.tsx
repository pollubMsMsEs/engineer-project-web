import Icon from "@mdi/react";
import {
    MetaObject,
    Person as PersonType,
    PersonInWork,
    WorkFromAPIPopulated,
} from "../../types/types";
import React from "react";
import { mdiAccountGroup } from "@mdi/js";
import Person from "../person/Person";
import styles from "./workPeople.module.scss";

type PeopleByRole = {
    [role: string]: (PersonType & {
        _id: string;
        details?: MetaObject;
    })[];
};

type PersonInWorkFromAPI = PersonInWork & {
    person_id: PersonType & { _id: string };
};

function groupPeopleInWorkByRole(people: PersonInWorkFromAPI[]) {
    return Object.entries(
        people
            .filter((p) => p?.person_id?._id)
            .reduce((peopleByRole: PeopleByRole, person) => {
                const newPerson = {
                    ...person.person_id,
                    details: person.details,
                };

                if (person.role in peopleByRole) {
                    peopleByRole[person.role].push(newPerson);
                } else {
                    peopleByRole[person.role] = [newPerson];
                }

                return peopleByRole;
            }, {})
    );
}

export default function WorkPeople({
    work,
    readOnly,
}: {
    work: WorkFromAPIPopulated;
    readOnly: boolean;
}) {
    console.log(work);
    const peopleByRole = groupPeopleInWorkByRole(work.people);

    return (
        <div className={styles["work-people"]}>
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <Icon path={mdiAccountGroup} size={2} />
                <h3>People</h3>
            </span>
            <div>
                {peopleByRole.map(([role, people]) => (
                    <div key={role}>
                        <h3>
                            {role.charAt(0).toUpperCase() +
                                role.substring(1) +
                                "(s)"}
                        </h3>
                        <div>
                            {people.map((p) => (
                                <div key={p._id}>
                                    <Person
                                        person={p}
                                        details={p.details}
                                        readOnly={readOnly}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
