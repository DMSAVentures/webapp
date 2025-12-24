/**
 * Table Component
 * A compound component for building flexible data tables
 *
 * @example
 * ```tsx
 * <Table>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.HeaderCell>Name</Table.HeaderCell>
 *       <Table.HeaderCell sortable sortDirection="asc" onSort={() => {}}>Email</Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row onClick={() => {}} selected>
 *       <Table.Cell>John Doe</Table.Cell>
 *       <Table.Cell>john@example.com</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */

import { Table as TableRoot, type TableProps } from "./table";
import { TableHeader, type TableHeaderProps } from "./TableHeader";
import { TableBody, type TableBodyProps } from "./TableBody";
import { TableRow, type TableRowProps } from "./TableRow";
import { TableHeaderCell, type TableHeaderCellProps, type SortDirection } from "./TableHeaderCell";
import { TableCell, type TableCellProps } from "./TableCell";
import { TableExpandedRow, type TableExpandedRowProps } from "./TableExpandedRow";

// Create compound component
type TableCompound = typeof TableRoot & {
	Header: typeof TableHeader;
	Body: typeof TableBody;
	Row: typeof TableRow;
	HeaderCell: typeof TableHeaderCell;
	Cell: typeof TableCell;
	ExpandedRow: typeof TableExpandedRow;
};

const Table = TableRoot as TableCompound;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
Table.ExpandedRow = TableExpandedRow;

export { Table };
export type {
	TableProps,
	TableHeaderProps,
	TableBodyProps,
	TableRowProps,
	TableHeaderCellProps,
	TableCellProps,
	TableExpandedRowProps,
	SortDirection,
};
