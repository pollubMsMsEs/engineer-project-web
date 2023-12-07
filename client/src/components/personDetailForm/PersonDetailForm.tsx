import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./personDetailForm.module.scss";

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
        <div>
            <Input
                id="key"
                type="text"
                name="key"
                label="Key"
                value={data.key}
                required
                onChange={(value) => {
                    data.key = value;
                    editDetailCallback(uniqueKey, data);
                }}
            />
            {data && (
                <Input
                    id="values"
                    type="text"
                    name="values"
                    label="Values"
                    value={data.values.join(" ")}
                    required
                    onChange={(value, e) => {
                        if (value.includes(",")) {
                            e.target.setCustomValidity(
                                "Seperate values with space, not colon"
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
                -
            </Button>
        </div>
    );
}
