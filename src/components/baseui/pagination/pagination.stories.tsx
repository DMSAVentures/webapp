import Pagination from "@/components/baseui/pagination/pagination";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {useState} from "react";

const meta: Meta = {
    title: 'Components/Pagination',
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        totalPages: { control: 'number' },
        itemsPerPage: { control: 'number' },
        currentPage: { control: 'number' },
        style: { control: 'select', options: ['rounded', 'squared', 'row'] },
        onPageChange: { action: 'pageChanged' },
    },
    args: { onClick: fn() },
} as Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create stories with dynamic page handling
const createPaginationStory = (initialArgs) => {
    const StoryComponent = (args) => {
        const [currentPage, setCurrentPage] = useState(args.currentPage);

        const handlePageChange = (page: number) => {
            setCurrentPage(page);
            args.onPageChange(page);
        };

        return <Pagination {...args} currentPage={currentPage} onPageChange={handlePageChange} />;
    };

    return {
        render: (args) => <StoryComponent {...args} />,
    args: initialArgs,
};
};


export const Primary: Story = createPaginationStory({
    totalPages: 10,
    itemsPerPage: 10,
    currentPage: 1,
    style: 'rounded',
});

export const Secondary: Story = createPaginationStory({
    totalPages: 10,
    itemsPerPage: 10,
    currentPage: 1,
    style: 'squared',
});

export const Tertiary: Story = createPaginationStory({
    totalPages: 10,
    itemsPerPage: 10,
    currentPage: 1,
    style: 'row',
});

export const TooManyPages: Story = createPaginationStory({
    totalPages: 100,
    itemsPerPage: 10,
    currentPage: 1,
    style: 'rounded',
});
