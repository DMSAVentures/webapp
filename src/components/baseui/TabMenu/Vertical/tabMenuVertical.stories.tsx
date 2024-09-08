import {TabMenuVertical} from '@/components/baseui/TabMenu/Vertical/tabMenuVertical'
import {TabMenuVerticalItem} from '@/components/baseui/TabMenu/Vertical/tabMenuVerticalItem'
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
            <TabMenuVerticalItem key={1} text={'Personal Details'} active={false} />,
            <TabMenuVerticalItem key={2} text="Experience" active={true} />,
            <TabMenuVerticalItem key={3} text="References" active={false} />,
        ],
    },
}


export const VerticalCardMenu: Story = {
    args: {
        title: 'Tab Menu Vertical',
        variant: 'card',
        items: [
            <TabMenuVerticalItem key={1} text={'Personal Details'} active={false} />,
            <TabMenuVerticalItem key={2} text="Experience" active={true} />,
            <TabMenuVerticalItem key={3} text="References" active={false} />,
        ],
    },
}
