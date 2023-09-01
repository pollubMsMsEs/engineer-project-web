import React from "react";
import Logo from "@/components/Logo";
import styles from "./layout.module.scss";
import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <div className={styles.componentDefaultLayout}>
            <header style={{ display: "flex" }}>
                <Logo />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                    }}
                >
                    <div>Temp username</div>
                    <Link href={"/api/auth/logout"}>Logout</Link>
                </div>
            </header>
            <aside>
                <a href="/">Home</a>
                <a href="/all">Everything list</a>
                <a href="/movie/all">Movies table</a>
                <a href="/person/all">People table</a>
            </aside>
            <main className="content">{children}</main>
        </div>
    );
    /*
  <ToastContainer
                position={toast.POSITION.BOTTOM_CENTER}
                theme="dark"
            />
            */
}
