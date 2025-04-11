'use client';
import ChatBox from "@/components/ai/chatbox";
import {Column} from "@/components/simpleui/UIShell/Column/Column";

export default function Page() {
    return (
        <Column sm={{span: 7, start: 1}} >
            <ChatBox/>
        </Column>
    )
}
