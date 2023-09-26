import React from "react";

export default function InstancesGrid({
    title,
    children,
}: React.PropsWithChildren<{ title: string }>) {
    return (
        <div>
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}
