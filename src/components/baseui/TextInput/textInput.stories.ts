import {TextInput } from "@/components/baseui/TextInput/textInput";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta =  {
    title: 'Components/TextInput',
    component: TextInput,
    argTypes: {
        label: {control: 'text'},
        hint: {control: 'text'},
        error: {control: 'text'},
        leftIcon: {control: 'text'},
        showLeftIcon: {control: 'boolean'},
        rightIcon: {control: 'text'},
        showRightIcon: {control: 'boolean'},
    },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
    },
};

export const WithLeftIcon: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        leftIcon: 'ri-user-line',
        showLeftIcon: true,
    },
};

export const WithRightIcon: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        rightIcon: 'ri-user-line',
        showRightIcon: true,
    },
};

export const WithBothIcons: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        leftIcon: 'ri-user-line',
        showLeftIcon: true,
        rightIcon: 'ri-user-line',
        showRightIcon: true,
    },
};

export const WithError: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        error: 'Error',
    },
};

export const Required: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        required: true,
    },
};

export const Optional: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        required: false,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        hint: 'Hint',
        disabled: true,
    },
};





