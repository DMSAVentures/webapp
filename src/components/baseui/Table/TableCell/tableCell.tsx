import React, {ReactElement} from "react";
import './table-cell.scss';
import ContentLabel from "@/components/baseui/label/contentlabel";
import ButtonGroup from "@/components/baseui/buttongroup/buttongroup";
import Button from "@/components/baseui/button/button";
import ProgressBarLine from "@/components/baseui/progressbar/progressbar";
import StatusBadge from "@/components/baseui/StatusBadge/statusBadge";
import Checkbox from "@/components/baseui/checkbox/checkbox";
import {BadgeGroup} from "@/components/baseui/badge/badgeGroup";

type AllowedChildren = ReactElement<typeof ContentLabel> |
    ReactElement<typeof ButtonGroup> |
    ReactElement<typeof Button> |
    ReactElement<typeof ProgressBarLine> |
    ReactElement<typeof StatusBadge> |
    ReactElement<typeof Checkbox> |
    ReactElement<typeof BadgeGroup> |
    string |
    number |
    boolean;
export interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement>{
    children: AllowedChildren;
}

const isContentLabelComponent = (child: React.ReactNode): boolean => {
    return React.isValidElement(child) && child.type === ContentLabel;
};
export const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {
    const isLabel = isContentLabelComponent(props.children)
    return (
        <td>
        <div className={`table-cell table-cell__${isLabel ? 'content-label' : 'misc'}`}>
            {props.children}
        </div>
        </td>
    )
}
