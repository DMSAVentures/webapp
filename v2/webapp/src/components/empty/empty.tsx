import React from "react";
import {Column} from "@/components/simpleui/UIShell/Column/Column";

interface EmptyStateProps {
    message: string;
}
export const EmptyState: React.FC<EmptyStateProps> = (props: EmptyStateProps) => {
    return (
        <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                xlg={{start: 1, span: 13}}>
            <p>props.message</p>
        </Column>
    )
}
