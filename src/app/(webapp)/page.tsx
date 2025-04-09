'use client';
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import React from "react";
import ChatBox from "@/components/ai/chatbox";

export default function Home() {
    return (
        <>

                <Column sm={{span: 8, start: 1}}>
                    <ChatBox/>
                </Column>
        </>
    );
}
