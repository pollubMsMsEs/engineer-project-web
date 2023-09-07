export default function ErrorsDisplay({
    errors,
    containerClass,
    errorsClass,
}: {
    errors?: any[];
    containerClass?: string;
    errorsClass?: string;
}) {
    return (
        <>
            {errors && (
                <div className={containerClass}>
                    {errors.map((error) => (
                        <div
                            key={`${error.path ?? ""} ${error.msg}`}
                            className={errorsClass}
                        >
                            {`${error.path ?? ""}: ${error.msg}`}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
