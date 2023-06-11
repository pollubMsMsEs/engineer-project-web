import { PersonInMovie } from "../types/movieType";
import PersonDetailsForm from "./PersonDetailsForm";

export type PersonInMovieFormType = PersonInMovie & {
    react_key: number;
    person_id: string;
} & {
    formDetails: {
        [reactKey: number]: {
            key: string;
            values: string[];
        };
    };
};

export default function PersonInMovieForm({
    person,
    index,
    editPersonCallback,
    deletePersonCallback,
    setEditedRoleCallback,
    getUniqueKey,
}: {
    person: PersonInMovieFormType;
    index: number;
    editPersonCallback: (person: PersonInMovieFormType) => void;
    deletePersonCallback: (person: PersonInMovieFormType) => void;
    setEditedRoleCallback: (role: string) => void;
    getUniqueKey: () => number;
}) {
    function editDetailsCallback(
        key: number,
        data: {
            key: string;
            values: string[];
        }
    ) {
        person.formDetails[key] = data;

        editPersonCallback(person);
    }

    function deleteDetailCallback(key: number) {
        delete person.formDetails[key];
        editPersonCallback(person);
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "min-content 1fr",
                gap: "5px",
            }}
        >
            <button
                type="button"
                style={{
                    gridColumn: "2",
                    justifySelf: "end",
                    padding: "0 10px",
                }}
                onClick={() => {
                    deletePersonCallback(person);
                }}
            >
                -
            </button>
            <label htmlFor={`person${index}`}>Person</label>
            <input
                type="text"
                id={`person${index}`}
                value={person.person_id}
                onChange={(e) => {
                    person.person_id = e.target.value;
                    editPersonCallback(person);
                }}
            />
            <label htmlFor={`role${index}`}>Role</label>
            {person.person_id === "" ? (
                <span>Pick person to set role</span>
            ) : (
                <input
                    type="text"
                    id={`role${index}`}
                    list="people-roles"
                    value={person.role}
                    onChange={(e) => {
                        person.role = e.target.value;
                        setEditedRoleCallback(e.target.value);
                        editPersonCallback(person);
                    }}
                    onFocus={(e) => {
                        setEditedRoleCallback(e.target.value);
                    }}
                    onBlur={() => {
                        setEditedRoleCallback("");
                    }}
                />
            )}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    gridColumn: "1 / -1",
                }}
            >
                <h4 style={{ margin: "0" }}>Details</h4>
                <button
                    style={{ padding: "5px", aspectRatio: "1/1" }}
                    type="button"
                    onClick={() => {
                        const uniqueKey = getUniqueKey();
                        if (person.formDetails == undefined) {
                            person.formDetails = {
                                [uniqueKey]: {
                                    key: "",
                                    values: [""],
                                },
                            };
                        } else {
                            person.formDetails[uniqueKey] = {
                                key: "",
                                values: [""],
                            };
                        }

                        editPersonCallback(person);
                    }}
                >
                    +
                </button>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: "5px",
                    gridColumn: "1 / -1",
                }}
            >
                {person.formDetails &&
                    Object.entries(person.formDetails).map(
                        ([reactKey, data]) => (
                            <PersonDetailsForm
                                key={reactKey}
                                uniqueKey={Number.parseInt(reactKey)}
                                data={data}
                                editDetailsCallback={editDetailsCallback}
                                deleteDetailCallback={deleteDetailCallback}
                            />
                        )
                    )}
            </div>
        </div>
    );
}
