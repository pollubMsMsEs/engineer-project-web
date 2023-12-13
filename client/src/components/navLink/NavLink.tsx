"use client";

import Link from "next/link";
import React from "react";
import styles from "./navLink.module.scss";
import Icon from "@mdi/react";
import { usePathname } from "next/navigation";
import { UrlObject } from "url";

export default function NavLink({
    href,
    icon,
    title,
    style,
}: {
    href: string | UrlObject;
    icon: string;
    title: string;
    style: "centered" | "inline";
}) {
    const pathname = usePathname();
    let classList = styles["nav-link"];
    classList += ` ${styles[`nav-link--style-${style}`]}`;

    classList += pathname === href ? ` ${styles["nav-link--active"]}` : "";

    return (
        <Link className={classList} href={href}>
            <Icon path={icon} />
            <span>{title}</span>
        </Link>
    );
}
