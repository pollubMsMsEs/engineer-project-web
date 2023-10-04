"use client";

import React from "react";
import { Tooltip } from "react-tooltip";

export default function TooltipWrapper({ id }: { id: string }) {
    return <Tooltip id={id} />;
}
