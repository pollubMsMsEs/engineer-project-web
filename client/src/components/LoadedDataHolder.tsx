import React from "react";
import LoadingCircle from "./LoadingCircle";

export default function LoadedDataHolder({
    children,
    message = "-",
}: {
    children: React.ReactNode | undefined | false;
    message?: string;
}) {
    if (children === false) return <>{message}</>;
    if (children === undefined) return <LoadingCircle size="15px" />;

    return <>{children}</>;
}
