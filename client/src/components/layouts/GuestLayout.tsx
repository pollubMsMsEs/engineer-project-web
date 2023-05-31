import React from "react";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
    return (
        <div>
            <h1>Guest Layout</h1>
            <Outlet />
        </div>
    );
}
