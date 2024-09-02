import {TableHeader} from "@/components/baseui/Table/TableHeader/TableHeader";
import {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";

const onSort = (sortOrder: 'asc' | 'desc') => {
    console.log(sortOrder);
}

const onSelectAll = (checked: boolean) => {
    console.log(checked);
}
const meta: Meta = {
    title: 'Components/TableHeader',
    component: TableHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
        // onSort: { control: 'function' },
        sortDirection: { control: 'select', options: ['asc', 'desc'] },
        sortable: { control: 'boolean' },
        // onSelectAll: { control: 'function' },
        selectable: { control: 'boolean' },
    },
    args: { onSort, onSelectAll},
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Table Header',
    },
}


export const Disabled: Story = {
    args: {
        children: 'Table Header',
        disabled: true,
    },
}


export const Empty: Story = {
    args: {
    },
}

export const Sortable: Story = {
    args: {
        children: 'Table Header',
        sortable: true,
    },
}

export const Selectable: Story = {
    args: {
        children: 'Table Header',
        selectable: true,
    },
}

export const SortableAndSelectable: Story = {
    args: {
        children: 'Table Header',
        sortable: true,
        selectable: true,
    },
}
