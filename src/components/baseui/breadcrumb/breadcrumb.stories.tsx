import Breadcrumb  from "@/components/baseui/breadcrumb/breadcrumb";
import BreadcrumbItem  from "@/components/baseui/breadcrumb/breadcrumbitem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
        divider: { control: 'select', options: ['arrow', 'dot', 'slash'] },
    },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        items: [
            <BreadcrumbItem text="Home"  state={'active'}/>,
            <BreadcrumbItem text="Library" state={'default'} />,
            <BreadcrumbItem text="Data" state={'default'} />,
        ],
        divider: 'arrow',
    },
};

export const WithDotDivider: Story = {
    args: {
        items: [
            <BreadcrumbItem text="Home"  state={'active'}/>,
            <BreadcrumbItem text="Library" state={'default'} />,
            <BreadcrumbItem text="Data" state={'default'} />,
        ],
        divider: 'dot',
    },
};

export const WithSlashDivider: Story = {
    args: {
        items: [
            <BreadcrumbItem text="Home"  state={'active'}/>,
            <BreadcrumbItem text="Library" state={'default'} />,
            <BreadcrumbItem text="Data" state={'default'} />,
        ],
        divider: 'slash',
    },
};

export const WithIcon: Story = {
    args: {
        items: [
            <BreadcrumbItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <BreadcrumbItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <BreadcrumbItem text="Data" icon={'ri-database-line'} state={'default'} />,
        ],
        divider: 'arrow',
    },
};


export const TooManyItems: Story = {
    args: {
        items: [
            <BreadcrumbItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <BreadcrumbItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <BreadcrumbItem text="Data" icon={'ri-database-line'} state={'default'} />,
            <BreadcrumbItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <BreadcrumbItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <BreadcrumbItem text="Data" icon={'ri-database-line'} state={'default'} />,
            <BreadcrumbItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <BreadcrumbItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <BreadcrumbItem text="Data" icon={'ri-database-line'} state={'default'} />,
        ],
        divider: 'arrow',
    },
};
