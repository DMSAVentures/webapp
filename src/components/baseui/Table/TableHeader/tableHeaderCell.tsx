import React from 'react';
import './table-header.scss';
import Checkbox from "@/components/baseui/checkbox/checkbox";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
    onSort?: (sortOrder:'asc' | 'desc') => void;
    sortDirection?: 'asc' | 'desc';
    sortable?: boolean;
    onSelectAll?: (checked: boolean) => void;
    selectable?: boolean;
    disabled?: boolean;
}

function evaluateSortIcon(sortDirection: 'asc' | 'desc' | undefined, onClick?: (sortOrder:'asc' | 'desc') => void){
    if (sortDirection === 'asc') {
        return <i className="ri-arrow-up-s-fill" onClick={() => onClick && onClick('desc')}></i>;
    } else if (sortDirection === 'desc') {
        return <i className="ri-arrow-down-s-fill" onClick={() => onClick && onClick('asc')}></i>;
    }

    return <i className="ri-expand-up-down-fill" onClick={() => onClick && onClick('asc')}></i>
}

export const TableHeaderCell: React.FC<TableHeaderProps> = ({ children, ...props }) => {

    const sortIcon = evaluateSortIcon(props.sortDirection, props.onSort);
    const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
        if (props.onSelectAll) {
            props.onSelectAll(event.currentTarget.checked);
        }
    }
    return (
        <th>
        <div className={`table-header`} {...props} aria-disabled={props.disabled}>
            {props.selectable ? <Checkbox onClick={handleCheckboxClick} disabled={props.disabled} /> : null}
            <div className={'table-header__container'}>
                {children ? children : '\u00A0'}
            </div>
            {props.sortable ? sortIcon : null}
        </div>
        </th>
    );
}
