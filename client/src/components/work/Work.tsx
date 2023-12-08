import {
    MetaObject,
    Person as PersonType,
    PersonInWork,
    WorkFromAPIPopulated,
} from "../../types/types";
import dayjs from "dayjs";
import Person from "../person/Person";
import styles from "./work.module.scss";
import { capitalize } from "radash";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiImageOff } from "@mdi/js";
import Markdown from "react-markdown";
import { getAspectRatio, getTypeIcon } from "@/modules/ui";
import ImageContainer from "../imageContainer/ImageContainer";

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

export default function Work({
    work,
    readOnly,
}: {
    work: WorkFromAPIPopulated;
    readOnly: boolean;
}) {
    const peopleByRole = groupPeopleInWorkByRole(work.people);

    const icon = getTypeIcon(work.type);
    let iconClass = styles["work-container__icon"];

    iconClass += icon.big ? ` ${styles["work-container__icon--big"]}` : "";

    return (
        <div className={styles["work-container"]}>
            <h2 className={styles["work-container__title"]}>
                <Icon path={icon.path} className={iconClass} />
                <span>{work.title}</span>
            </h2>
            <ImageContainer
                src={work.cover}
                alt="Work cover"
                aspectRatio={getAspectRatio(work.type)}
            />
            <div>
                <span className={styles["label"]}>Description: </span>
                <span>
                    <Markdown>{work?.description ?? ""}</Markdown>
                </span>
            </div>
            <div>
                <span className={styles["label"]}>Published at: </span>
                {work?.published_at
                    ? dayjs(work.published_at).format("YYYY-MM-DD")
                    : ""}
            </div>
            <div>
                <span className={styles["label"]}>Genres: </span>
                <span>
                    {work?.genres.reduce((acc, genre) => {
                        return `${acc}${genre}, `;
                    }, "") ?? ""}
                </span>
            </div>
            <div className={styles["roles"]}>
                {peopleByRole.map(([role, people]) => (
                    <div key={role}>
                        <h3>
                            {role.charAt(0).toUpperCase() +
                                role.substring(1) +
                                "(s)"}
                        </h3>
                        <div className={styles["people"]}>
                            {people.map((p) => (
                                <div key={p._id} className={styles["person"]}>
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
            <h3>Metadata</h3>
            <div className={styles["metadata"]}>
                {Object.entries(work.metadata).map(([key, values]) => (
                    <div key={key}>
                        <span>
                            {key.charAt(0).toUpperCase() + key.substring(1)}
                            {": "}
                        </span>
                        <span>{values[0]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
