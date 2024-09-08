import {Toggle} from "@/components/baseui/Toggle/toggle";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta =  {
    title: 'Components/Toggle',
    component: Toggle,
    argTypes: {
        checked: {control: 'boolean'},
    },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        checked: false,
    },
};

export const Checked: Story = {
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    args: {
        checked: false,
        disabled: true,
    },
};

export const CheckedDisabled: Story = {
    args: {
        checked: true,
        disabled: true,
    },
};

export const WithLabel: Story = {
    args: {
        checked: false,
        label: 'Toggle',
    },
};
