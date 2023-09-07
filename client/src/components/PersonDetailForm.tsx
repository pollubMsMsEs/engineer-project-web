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
            <input
                type="text"
                value={data.key}
                required
                onChange={(e) => {
                    data.key = e.target.value;
                    editDetailCallback(uniqueKey, data);
                }}
            />
            {data && (
                <input
                    type="text"
                    value={data.values.join(" ")}
                    required
                    onChange={(e) => {
                        if (e.target.value.includes(",")) {
                            e.target.setCustomValidity(
                                "Seperate values with space, not colon"
                            );
                        } else {
                            e.target.setCustomValidity("");
                        }

                        data.values = e.target.value.split(" ");
                        editDetailCallback(uniqueKey, data);
                    }}
                />
            )}
            <button
                style={{
                    padding: "5px",
                    aspectRatio: "1/1",
                }}
                type="button"
                onClick={() => {
                    deleteDetailCallback(uniqueKey);
                }}
            >
                -
            </button>
        </div>
    );
}
