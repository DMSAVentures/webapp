import WebApp from "@/components/main/webapp";
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import React from "react";

export default function Home() {
    return (
        <>

                <Column sm={{span: 4, start: 1}}>
                    <WebApp/>
                </Column>
                <Column sm={{span: 1, start: 4}}>
                    Content
                </Column>
        </>
    );
}
