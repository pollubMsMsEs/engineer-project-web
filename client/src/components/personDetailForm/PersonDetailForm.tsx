import Icon from "@mdi/react";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./personDetailForm.module.scss";
import { mdiTrashCan } from "@mdi/js";

export default function PersonDetailForm({
    uniqueKey,
    data,
    editDetailCallback,
    deleteDetailCallback,
}: {
    uniqueKey: number;
    data: { key: string; values: string[] };
    editDetailCallback: (
        key: number,
        data: {
            key: string;
            values: string[];
        }
    ) => void;
    deleteDetailCallback: (key: number) => void;
}) {
    return (
        <div className={styles["person-detail"]}>
            <Input
                id={`key${uniqueKey}`}
                type="text"
                name="key"
                label="Key"
                labelDisplay="never"
                value={data.key}
                style={{ fontSize: "1rem" }}
                required
                onChange={(value) => {
                    data.key = value;
                    editDetailCallback(uniqueKey, data);
                }}
            />
            {data && (
                <Input
                    id={`values${uniqueKey}`}
                    type="text"
                    name="values"
                    label="Values"
                    labelDisplay="never"
                    value={data.values.join(" ")}
                    style={{ fontSize: "1rem" }}
                    required
                    onChange={(value, e) => {
                        if (value.includes(",")) {
                            e.target.setCustomValidity(
                                "Separate values with space, not colon"
                            );
                        } else {
                            e.target.setCustomValidity("");
                        }

                        data.values = value.split(" ");
                        editDetailCallback(uniqueKey, data);
                    }}
                />
            )}
            <Button
                type="button"
                onClick={() => {
                    deleteDetailCallback(uniqueKey);
                }}
            >
                <Icon path={mdiTrashCan} size="1.2rem" />
            </Button>
        </div>
    );
}
