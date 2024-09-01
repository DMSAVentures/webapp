import StepIndicatorHorizontal  from "@/components/baseui/stepindicatorhorizontal/stepIndicatorHorizontal";
import StepIndicatorHorizontalItem  from "@/components/baseui/stepindicatorhorizontal/stepIndicatorItem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/StepIndicator Horizontal',
    component: StepIndicatorHorizontal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
        divider: { control: 'select', options: ['arrow', 'dot', 'slash'] },
    },
} satisfies Meta<typeof StepIndicatorHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem text="Home"  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" state={'default'} />,
        ],
        divider: 'arrow',
    },
};

export const WithDotDivider: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem text="Home"  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" state={'default'} />,
        ],
        divider: 'dot',
    },
};

export const WithSlashDivider: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem text="Home"  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" state={'default'} />,
        ],
        divider: 'slash',
    },
};

export const WithIcon: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" icon={'ri-database-line'} state={'default'} />,
        ],
        divider: 'arrow',
    },
};


export const TooManyItems: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" icon={'ri-database-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" icon={'ri-database-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Home" icon={'ri-home-line'}  state={'active'}/>,
            <StepIndicatorHorizontalItem text="Library" icon={'ri-book-line'} state={'default'} />,
            <StepIndicatorHorizontalItem text="Data" icon={'ri-database-line'} state={'default'} />,
        ],
        divider: 'arrow',
    },
};
