'use client'
import "./sidenav.scss";
import React from "react";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useRef} from "react";

export default function Sidenav() {
    const sidenavRef = useRef<HTMLDivElement>(null);
    const [showSideNav, setShowSideNav] = React.useState(false);

    useEffect(() => {
        if (sidenavRef.current) {
            sidenavRef.current.style.width = showSideNav ? "250px" : "0";
        }
    }, [showSideNav]);

    return (
        <div ref={sidenavRef} className={"sidenav"}>
            <button className={"closebtn"} onClick={() => setShowSideNav(false)}/>
            <a href={"/"}>Home</a>
            <a href={"/about"}>About</a>
            <a href={"/services"}>Services</a>
            <a href={"/contact"}>Contact</a>
        </div>
    );
}
