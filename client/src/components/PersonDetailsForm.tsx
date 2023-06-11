export default function PersonDetailsForm({
    uniqueKey,
    data,
    editDetailsCallback,
    deleteDetailCallback,
}: {
    uniqueKey: number;
    data: { key: string; values: string[] };
    editDetailsCallback: (
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
                onChange={(e) => {
                    data.key = e.target.value;
                    editDetailsCallback(uniqueKey, data);
                }}
            />
            {data && (
                <input
                    type="text"
                    value={data.values.join(" ")}
                    onChange={(e) => {
                        data.values = e.target.value.split(" ");
                        editDetailsCallback(uniqueKey, data);
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
