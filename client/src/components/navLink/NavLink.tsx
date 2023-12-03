"use client";

import Link from "next/link";
import React from "react";
import styles from "./navlink.module.scss";
import Icon from "@mdi/react";
import { usePathname } from "next/navigation";

export default function NavLink({
    href,
    icon,
    title,
}: {
    href: string;
    icon: string;
    title: string;
}) {
    const pathname = usePathname();
    let classList = styles["nav-link"];

    classList += pathname === href ? ` ${styles["nav-link--active"]}` : "";

    return (
        <Link className={classList} href={href}>
            <Icon path={icon} />
            <span>{title}</span>
        </Link>
    );
}
