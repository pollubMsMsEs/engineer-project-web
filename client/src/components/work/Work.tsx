"use client";

import {
    MetaObject,
    Person as PersonType,
    PersonInWork,
    WorkFromAPIPopulated,
    WorkInstanceFromAPI,
} from "../../types/types";
import dayjs from "dayjs";
import Person from "../person/Person";
import styles from "./work.module.scss";
import Icon from "@mdi/react";
import {
    mdiAccountGroup,
    mdiCalendar,
    mdiCardText,
    mdiLabel,
    mdiPencil,
} from "@mdi/js";
import Markdown from "react-markdown";
import { getAspectRatio, getTypeIcon } from "@/modules/ui";
import ImageContainer from "../imageContainer/ImageContainer";
import WorkCore from "../workCore/WorkCore";
import WorkPeople from "../workPeople/WorkPeople";
import WorkMetadata from "../workMetadata/WorkMetadata";
import DeleteWork from "../deleteWorkButton/DeleteWorkButton";
import Button from "../button/Button";
import { useReducer, useState } from "react";
import Modal from "../modal/Modal";
import { useHandleRequest } from "@/hooks/useHandleRequests";
import WorkForm from "../workForm/WorkForm";

export default function Work({
    work: _work,
    workInstance,
}: {
    work: WorkFromAPIPopulated;
    workInstance:
        | WorkInstanceFromAPI
        | WorkInstanceFromAPI<WorkFromAPIPopulated>;
}) {
    const [workFormKey, refreshWorkFormKey] = useReducer(() => {
        return Date.now();
    }, Date.now());
    const [work, setWork] = useState(_work);
    const [editOpen, setEditOpen] = useState(false);
    const {
        errors,
        errorsKey,
        fetchingState,
        setFetchingState,
        handleResponse,
    } = useHandleRequest<"cover" | "work">();

    return (
        <>
            <WorkCore
                work={work}
                titleButtons={
                    <>
                        {!workInstance.from_api && (
                            <Button onClick={() => setEditOpen(!editOpen)}>
                                <Icon path={mdiPencil} size={1} />
                            </Button>
                        )}
                        <DeleteWork workInstance={workInstance} />
                    </>
                }
            />
            <WorkPeople work={work} readOnly />
            <WorkMetadata work={work} />
            <Modal isOpen={editOpen} setIsOpen={setEditOpen} size="screen">
                <WorkForm
                    key={workFormKey}
                    work={work}
                    errors={errors}
                    errorsKey={errorsKey}
                    fetchingState={fetchingState}
                    setFetchingState={setFetchingState}
                    handleResponse={handleResponse}
                    onSubmit={async (work) => {
                        setWork(work);
                        setEditOpen(false);
                        setFetchingState(false);
                        refreshWorkFormKey();
                    }}
                    onCancel={() => {
                        setEditOpen(false);
                        refreshWorkFormKey();
                    }}
                />
            </Modal>
        </>
    );
}
