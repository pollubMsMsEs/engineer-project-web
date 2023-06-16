export default function ErrorsDisplay({
    errors,
    containerStyle,
    errorsStyle,
}: {
    errors?: any[];
    containerStyle?: React.CSSProperties;
    errorsStyle?: React.CSSProperties;
}) {
    return (
        <>
            {errors && (
                <div style={containerStyle ?? { color: "#ef4444" }}>
                    {errors.map((error) => (
                        <div
                            key={`${error.path ?? ""} ${error.msg}`}
                            style={errorsStyle}
                        >
                            {`${error.path ?? ""}: ${error.msg}`}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
