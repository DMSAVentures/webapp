import {TableHeaderCell, TableHeaderProps} from "@/components/baseui/Table/TableHeader/tableHeaderCell";
import React from "react";
import './table.scss';
import {TableCell, TableCellProps} from "@/components/baseui/Table/TableCell/tableCell";
import Pagination from "@/components/baseui/pagination/pagination";
import Label from "@/components/baseui/label/label";

interface TableProps {
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    tableHeader: TableHeaderProps[]
    tableRows: TableCellProps[][]; // Array of table rows
    tableFooter?: TableCellProps[]; // Array of table footer cells
    title: string;
}

export const Table = (props: TableProps) => {
    return (<div className={'table'}>
            <p>{props.title}</p>
            <span>
                filter
            </span>
            <table>
                <thead>
                <tr>
                    {props.tableHeader.map((header, index) => {
                        return (<TableHeaderCell key={index} {...header}/>);
                    })}
                </tr>
                </thead>
                <tbody>
                {props.tableRows.map((row, index) => {
                    return (<tr className={'table-row--medium'} key={index}>
                            {row.map((cell, index) => {
                                return (<TableCell key={index} {...cell}>{cell.children}</TableCell>);
                            })}
                        </tr>);
                })}
                </tbody>
                {props.tableFooter && <tfoot>
                <tr className={'table-row--medium'}>
                    {props.tableFooter.map((cell, index) => {
                        return (<TableCell key={index} {...cell}>{cell.children}</TableCell>);
                    })}
                </tr>
                </tfoot>}
            </table>
            <div className={'table__pagination'}>
            <Pagination totalPages={props.totalPages} itemsPerPage={props.itemsPerPage} currentPage={props.currentPage}
                        style={'squared'} onPageChange={props.onPageChange}/>
            </div>
        </div>)
}
