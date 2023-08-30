"use client";

import React from "react";

export default function LogoutButton() {
    return (
        <button
            style={{}}
            onClick={() => {
                localStorage.removeItem("JWT_TOKEN");
                location.reload();
            }}
        >
            Logout
        </button>
    );
}
