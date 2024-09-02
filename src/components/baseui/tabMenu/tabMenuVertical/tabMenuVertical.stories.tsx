import {TabMenuVertical} from '@/components/baseui/tabMenu/tabMenuVertical/tabMenuVertical'
import {TabMenuVerticalItem} from '@/components/baseui/tabMenu/tabMenuVertical/tabMenuVerticalItem'
import {Meta, StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/TabMenuVertical',
    component: TabMenuVertical,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        variant: { control: 'select', options: ['card', 'default'] },
        items: { control: 'object' },
    },
} satisfies Meta<typeof TabMenuVertical>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
    args: {
        title: 'Tab Menu Vertical',
        variant: 'default',
        items: [
            <TabMenuVerticalItem text={'Personal Details'} active={false} />,
            <TabMenuVerticalItem text="Experience" active={true} />,
            <TabMenuVerticalItem text="References" active={false} />,
        ],
    },
}


export const VerticalCardMenu: Story = {
    args: {
        title: 'Tab Menu Vertical',
        variant: 'card',
        items: [
            <TabMenuVerticalItem text={'Personal Details'} active={false} />,
            <TabMenuVerticalItem text="Experience" active={true} />,
            <TabMenuVerticalItem text="References" active={false} />,
        ],
    },
}
