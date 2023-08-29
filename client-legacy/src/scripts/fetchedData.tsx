import LoadingCircle from "../components/LoadingCircle";

export default function fetchedData<T>(
    data: T,
    callback: (data: T) => JSX.Element | JSX.Element[],
    message = "-"
): JSX.Element | JSX.Element[] {
    if (data === false) return <>{message}</>;
    if (data === undefined) return <LoadingCircle size="15px" />;

    return callback(data);
}
