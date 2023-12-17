import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import AutocompleteBarOption from "./option/FoundPerson";
import { Person, PersonFromAPI } from "@/types/types";
import LoadingDisplay from "../loadingDisplay/LoadingDisplay";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import { toast } from "react-toastify";
import Input from "../input/Input";
import { personToString } from "@/modules/ui";
import styles from "./findPerson.module.scss";

export default function FindPerson({
    setPicked,
}: {
    setPicked: (person: PersonFromAPI) => void;
}) {
    const [query, setQuery] = useState("");
    const [selectedPerson, setSelectedTrack] = useState<{
        person: PersonFromAPI;
        personString: string;
    }>();
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [foundPeople, setFoundPeople] = useState<
        {
            person: PersonFromAPI;
            personString: string;
        }[]
    >([]);
    const { fetchingState, setFetchingState, handleResponse } =
        useHandleRequest<true>();
    const searchDebounce = useRef<NodeJS.Timeout>();

    useEffect(() => {
        async function findPeople() {
            const response = await fetch(`/api/person/all?query=${query}`);

            const foundPeople = (await handleResponse(response)).map(
                (person: PersonFromAPI) => ({
                    person: person,
                    personString: personToString(person),
                })
            );

            if (!foundPeople) {
                toast.error("Couldn't find people");
            } else {
                setFoundPeople(foundPeople);
            }

            setFetchingState(false);
        }

        if (searchDebounce.current != undefined) {
            clearTimeout(searchDebounce.current);
            setFetchingState(false);
        }

        if (query === "") return;

        setFetchingState(true);

        searchDebounce.current = setTimeout(async () => {
            findPeople();
            setFetchingState(false);
        }, 1000);
    }, [query, setFetchingState, handleResponse, setFoundPeople]);

    const handleSelectionMovement = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();

                if (selectedPerson == undefined) {
                    setSelectedTrack(foundPeople[0]);
                } else if (
                    event.key === "ArrowDown" &&
                    selectedPerson != undefined &&
                    foundPeople.indexOf(selectedPerson) < foundPeople.length - 1
                ) {
                    const newIndex = foundPeople.indexOf(selectedPerson) + 1;
                    setSelectedTrack(foundPeople[newIndex]);
                } else if (
                    event.key === "ArrowUp" &&
                    selectedPerson != undefined &&
                    foundPeople.indexOf(selectedPerson) > 0
                ) {
                    const newIndex = foundPeople.indexOf(selectedPerson) - 1;
                    setSelectedTrack(foundPeople[newIndex]);
                }
            }
        },
        [selectedPerson, foundPeople]
    );

    const handleSelectionInput = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter" && selectedPerson != undefined) {
                event.preventDefault();
                setPicked(selectedPerson.person);
                setVisible(false);
            }
        },
        [selectedPerson, setPicked]
    );

    useEffect(() => {
        if (foundPeople.length > 0 && focused) {
            window.addEventListener("keydown", handleSelectionMovement);
            window.addEventListener("keydown", handleSelectionInput);

            return () => {
                window.removeEventListener("keydown", handleSelectionMovement);
                window.removeEventListener("keydown", handleSelectionInput);
            };
        }
    }, [foundPeople, focused, handleSelectionMovement, handleSelectionInput]);

    if (
        selectedPerson &&
        !foundPeople.includes(selectedPerson) &&
        foundPeople.length !== 0
    ) {
        setSelectedTrack(foundPeople[0]);
    }

    let className = styles["autocomplete"];

    let inputClassName = styles["autocomplete__input"];
    inputClassName +=
        foundPeople.length > 0 ? ` ${styles["autocomplete__input--open"]}` : "";

    return (
        <div
            className={className}
            onMouseEnter={() => {
                setHovered(true);
            }}
            onMouseLeave={() => {
                setHovered(false);

                if (!focused) {
                    setVisible(false);
                }
            }}
        >
            <Input
                className={inputClassName}
                type="text"
                name="track"
                label="Find person"
                style={{
                    fontSize: "1rem",
                    width: "100%",
                    borderRadius: "5px 5px 0 0",
                }}
                value={query}
                onChange={(value) => {
                    setQuery(value);
                }}
                onFocus={() => {
                    setFocused(true);
                    setVisible(true);
                }}
                onBlur={() => {
                    setFocused(false);
                    if (!hovered) {
                        setVisible(false);
                    }
                }}
            />
            {fetchingState && <LoadingDisplay size="30px" />}
            <div className={styles["autocomplete__options"]}>
                {visible &&
                    foundPeople.map((person) => (
                        <AutocompleteBarOption
                            key={person.person._id}
                            selected={selectedPerson === person}
                            person={person}
                            setPicked={(person) => {
                                setPicked(person);
                                setVisible(false);
                            }}
                        />
                    ))}
            </div>
        </div>
    );
}
