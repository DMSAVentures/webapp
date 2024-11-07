import React from 'react';
import './columns.scss';

// Utility type to create a range of numbers from 1 to N
type Range<N extends number, Result extends number[] = []> = Result['length'] extends N
    ? Result[number]
    : Range<N, [...Result, Result['length']]>;

// Define column constraints based on SCSS column values
type SmColumn = Range<8>;   // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type MdColumn = Range<8>;   // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type LgColumn = Range<12>;  // 1 | 2 | ... | 12
type XlgColumn = Range<16>; // 1 | 2 | ... | 16
type MaxColumn = Range<32>; // 1 | 2 | ... | 32


interface ColumnProps {
    children: React.ReactNode;
    sm?: { start: SmColumn; span: SmColumn };
    md?: { start: MdColumn; span: MdColumn };
    lg?: { start: LgColumn; span: LgColumn };
    xlg?: { start: XlgColumn; span: XlgColumn };
    max?: { start: MaxColumn; span: MaxColumn };
}


export const Column: React.FC<ColumnProps> = ({ children, sm, md, lg, xlg, max }) => {
    // Generate class names based on props
    const classNames = [
        // 'column',
        sm ? `column--sm-start-${sm.start}-span-${sm.span}` : '',
        md ? `column--md-start-${md.start}-span-${md.span}` : '',
        lg ? `column--lg-start-${lg.start}-span-${lg.span}` : '',
        xlg ? `column--xlg-start-${xlg.start}-span-${xlg.span}` : '',
        max ? `column--max-start-${max.start}-span-${max.span}` : '',
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames}>{children}</div>;
};
