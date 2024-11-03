import React from 'react';
import './columns.scss';

interface ColumnProps {
    children: React.ReactNode;
    sm?: number;   // Columns span on small screens
    md?: number;   // Columns span on medium screens
    lg?: number;   // Columns span on large screens
    xlg?: number;  // Columns span on extra-large screens
    max?: number;  // Columns span on max screens
}

export const Column: React.FC<ColumnProps> = ({ children, sm, md, lg, xlg, max }) => {
    // Generate class names based on props
    const classNames = [
        'column',
        sm ? `column--sm-${sm}` : '',
        md ? `column--md-${md}` : '',
        lg ? `column--lg-${lg}` : '',
        xlg ? `column--xlg-${xlg}` : '',
        max ? `column--max-${max}` : '',
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames}>{children}</div>;
};
