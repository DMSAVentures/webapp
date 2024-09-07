import {Table} from "@/components/baseui/Table/Table/table";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/Table',
    component: Table,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        title: {
            control: 'text',
        },
        totalPages: {
            control: 'number',
        },
        itemsPerPage: {
            control: 'number',
        },
        currentPage: {
            control: 'number',
        },
        tableHeader: {
            control: 'object',
        },
        tableRows: {
            control: 'object',
        },
        tableFooter: {
            control: 'object',
        },
    },
    tags: ['autodocs'],
    args: {
        onPageChange: () => {},
    }
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'Table Title',
        totalPages: 1,
        itemsPerPage: 10,
        currentPage: 1,
        onPageChange: () => {},
        tableHeader: [
            {
                children: 'Header 1',

            },
            {
                children: 'Header 2',

            },
            {
                children: 'Header 3',

            },
        ],
        tableRows: [
            [
                {
                    children: 'Row 1 Cell 1',

                },
                {
                    children: 'Row 1 Cell 2',

                },
                {
                    children: 'Row 1 Cell 3',

                },
            ],
            [
                {
                    children: 'Row 2 Cell 1',

                },
                {
                    children: 'Row 2 Cell 2',

                },
                {
                    children: 'Row 2 Cell 3',

                },
            ],
        ],
        tableFooter: [
            {
                children: 'Footer 1',

            },
            {
                children: 'Footer 2',

            },
            {
                children: 'Footer 3',

            },
        ],
    },
};
