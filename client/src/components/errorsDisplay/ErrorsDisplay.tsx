export default function ErrorsDisplay({ errors }: { errors?: any[] }) {
    return (
        <>
            {errors && (
                <div>
                    {errors.map((error) => (
                        <div key={`${error.path ?? ""} ${error.msg}`}>
                            {`${error.path ?? ""}: ${error.msg}`}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
