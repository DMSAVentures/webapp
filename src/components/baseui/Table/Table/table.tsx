import {TableHeaderCell} from "@/components/baseui/Table/TableHeader/tableHeaderCell";
import React from "react";
import './table.scss';
import {TableCell} from "@/components/baseui/Table/TableCell/tableCell";

export const Table = () => {
    return (
        <table className={'table'}>
            <caption>Quarterly Financial Overview</caption>
            <thead>
            <tr>
                <TableHeaderCell selectable={true}>Quarter</TableHeaderCell>
                <TableHeaderCell>Revenue</TableHeaderCell>
                <TableHeaderCell>Expenses</TableHeaderCell>
                <TableHeaderCell>Net Profit</TableHeaderCell>
            </tr>
            </thead>
            <tbody>
            <tr className={'table-row--large'}>
                <TableCell>Q1</TableCell>
                <TableCell>$100,000</TableCell>
                <TableCell>$60,000</TableCell>
                <TableCell>$40,000</TableCell>
            </tr>
            <tr>
                <TableCell>Q2</TableCell>
                <TableCell>$120,000</TableCell>
                <TableCell>$70,000</TableCell>
                <TableCell>$50,000</TableCell>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <TableCell>Total</TableCell>
                <TableCell>$220,000</TableCell>
                <TableCell>$130,000</TableCell>
                <TableCell>$90,000</TableCell>
            </tr>
            </tfoot>
        </table>
    )
}
