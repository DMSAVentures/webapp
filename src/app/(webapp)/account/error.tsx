'use client';

import {Button} from "@/components/simpleui/Button/button";
import {Column} from "@/components/simpleui/UIShell/Column/Column";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {

    return (
        <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                xlg={{start: 1, span: 13}}>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <Button onClick={() => reset()}>Try again</Button>
        </Column>
    );
}
