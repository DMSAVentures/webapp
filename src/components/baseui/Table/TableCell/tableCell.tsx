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
    ReactElement<typeof BadgeGroup>;
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement>{
    size: 'medium' | 'large';
    children: AllowedChildren;
}

const isContentLabelComponent = (child: React.ReactNode): boolean => {
    return React.isValidElement(child) && child.type === ContentLabel;
};
export const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {
    const { size, children } = props;
    const isLabel = isContentLabelComponent(children)
    return (
        <td className={`table-cell table-cell--${size} table-cell__${isLabel ? 'content-label' : 'misc'}`}>
            {children}
        </td>
    )
}
