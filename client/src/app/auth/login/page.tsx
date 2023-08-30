"use client";

import React, { useEffect } from "react";

export default function Login() {
    useEffect(() => {
        fetch("https://httpbin.org/get").then((result) => console.log(result));
    }, []);

    return <div>login</div>;
}
