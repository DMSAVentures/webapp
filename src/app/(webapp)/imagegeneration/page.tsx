'use client';
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import ImageGenBox from "@/components/ai/imagegenbox";

export default function Page() {
    return (
        <Column sm={{span: 7, start: 1}} >
            <ImageGenBox/>
        </Column>
    )
}
