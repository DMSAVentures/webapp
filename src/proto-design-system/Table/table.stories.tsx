import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Table, type SortDirection } from "./index";
import StatusBadge from "../StatusBadge/statusBadge";
import Checkbox from "../checkbox/checkbox";

const meta: Meta<typeof Table> = {
	title: "ProtoDesignSystem/Table",
	component: Table,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const users = [
	{ id: "1", name: "John Doe", email: "john@example.com", status: "active", role: "Admin" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com", status: "pending", role: "User" },
	{ id: "3", name: "Bob Johnson", email: "bob@example.com", status: "active", role: "User" },
	{ id: "4", name: "Alice Brown", email: "alice@example.com", status: "inactive", role: "Editor" },
];

/**
 * Basic table with static content
 */
export const Basic: Story = {
	render: () => (
		<Table>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Email</Table.HeaderCell>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<Table.HeaderCell>Role</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{users.map((user) => (
					<Table.Row key={user.id}>
						<Table.Cell>{user.name}</Table.Cell>
						<Table.Cell>{user.email}</Table.Cell>
						<Table.Cell fitContent>
							<StatusBadge
								text={user.status}
								variant={user.status === "active" ? "completed" : user.status === "pending" ? "pending" : "failed"}
								styleType="light"
							/>
						</Table.Cell>
						<Table.Cell>{user.role}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	),
};

/**
 * Table with sortable columns
 */
export const Sortable: Story = {
	render: function SortableTable() {
		const [sortField, setSortField] = useState<string | null>("name");
		const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

		const handleSort = (field: string) => {
			if (sortField === field) {
				setSortDirection(sortDirection === "asc" ? "desc" : "asc");
			} else {
				setSortField(field);
				setSortDirection("asc");
			}
		};

		const sortedUsers = [...users].sort((a, b) => {
			if (!sortField) return 0;
			const aVal = a[sortField as keyof typeof a];
			const bVal = b[sortField as keyof typeof b];
			const comparison = String(aVal).localeCompare(String(bVal));
			return sortDirection === "asc" ? comparison : -comparison;
		});

		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell
							sortable
							sortDirection={sortField === "name" ? sortDirection : null}
							onSort={() => handleSort("name")}
						>
							Name
						</Table.HeaderCell>
						<Table.HeaderCell
							sortable
							sortDirection={sortField === "email" ? sortDirection : null}
							onSort={() => handleSort("email")}
						>
							Email
						</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell
							sortable
							sortDirection={sortField === "role" ? sortDirection : null}
							onSort={() => handleSort("role")}
						>
							Role
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedUsers.map((user) => (
						<Table.Row key={user.id}>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell fitContent>
								<StatusBadge
									text={user.status}
									variant={user.status === "active" ? "completed" : user.status === "pending" ? "pending" : "failed"}
									styleType="light"
								/>
							</Table.Cell>
							<Table.Cell>{user.role}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		);
	},
};

/**
 * Table with selectable rows
 */
export const Selectable: Story = {
	render: function SelectableTable() {
		const [selectedIds, setSelectedIds] = useState<string[]>([]);

		const handleSelectAll = () => {
			if (selectedIds.length === users.length) {
				setSelectedIds([]);
			} else {
				setSelectedIds(users.map((u) => u.id));
			}
		};

		const handleSelectRow = (id: string) => {
			setSelectedIds((prev) =>
				prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
			);
		};

		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell narrow>
							<Checkbox
								checked={selectedIds.length === users.length ? "checked" : "unchecked"}
								onChange={handleSelectAll}
								aria-label="Select all"
							/>
						</Table.HeaderCell>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Email</Table.HeaderCell>
						<Table.HeaderCell>Role</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{users.map((user) => (
						<Table.Row
							key={user.id}
							selected={selectedIds.includes(user.id)}
							onClick={() => handleSelectRow(user.id)}
						>
							<Table.Cell narrow>
								<Checkbox
									checked={selectedIds.includes(user.id) ? "checked" : "unchecked"}
									onChange={() => handleSelectRow(user.id)}
									onClick={(e) => e.stopPropagation()}
								/>
							</Table.Cell>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>{user.role}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		);
	},
};

/**
 * Table with expandable rows
 */
export const Expandable: Story = {
	render: function ExpandableTable() {
		const [expandedId, setExpandedId] = useState<string | null>(null);

		const toggleExpand = (id: string) => {
			setExpandedId((prev) => (prev === id ? null : id));
		};

		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Email</Table.HeaderCell>
						<Table.HeaderCell>Role</Table.HeaderCell>
						<Table.HeaderCell narrow />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{users.map((user) => (
						<>
							<Table.Row
								key={user.id}
								expandable
								expanded={expandedId === user.id}
								onClick={() => toggleExpand(user.id)}
							>
								<Table.Cell>{user.name}</Table.Cell>
								<Table.Cell>{user.email}</Table.Cell>
								<Table.Cell>{user.role}</Table.Cell>
								<Table.Cell narrow>
									<i
										className={`ri-arrow-${expandedId === user.id ? "up" : "down"}-s-line`}
										style={{ fontSize: "20px", color: "var(--color-text-tertiary-default)" }}
									/>
								</Table.Cell>
							</Table.Row>
							{expandedId === user.id && (
								<Table.ExpandedRow colSpan={4}>
									<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
										<strong>User Details</strong>
										<p style={{ margin: 0 }}>
											This is the expanded content for {user.name}. You can display
											additional details, forms, or any other content here.
										</p>
										<p style={{ margin: 0, color: "var(--color-text-secondary-default)" }}>
											Status: {user.status}
										</p>
									</div>
								</Table.ExpandedRow>
							)}
						</>
					))}
				</Table.Body>
			</Table>
		);
	},
};

/**
 * Table in loading state
 */
export const Loading: Story = {
	args: {
		loading: true,
		loadingMessage: "Loading users...",
	},
	render: (args) => (
		<Table {...args}>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderCell>Email</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell>This won't be visible</Table.Cell>
					<Table.Cell>Because loading is true</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	),
};

/**
 * Table with custom min-width for responsive behavior
 */
export const ResponsiveWidth: Story = {
	args: {
		minWidth: "600px",
	},
	render: (args) => (
		<div style={{ maxWidth: "400px", border: "1px dashed #ccc", padding: "16px" }}>
			<p style={{ marginTop: 0 }}>Container is 400px wide, table scrolls horizontally</p>
			<Table {...args}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Email</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell>Role</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{users.slice(0, 2).map((user) => (
						<Table.Row key={user.id}>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>{user.status}</Table.Cell>
							<Table.Cell>{user.role}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</div>
	),
};
