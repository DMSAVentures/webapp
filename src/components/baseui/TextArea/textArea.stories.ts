import {TextArea} from "@/components/baseui/TextArea/textArea";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/TextArea',
    component: TextArea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        rows: { control: 'number' },
        cols: { control: 'number' },
        hint: { control: 'text' },
        label: { control: 'text' },
    },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Placeholder',
        rows: 4,
        cols: 50,
        hint: 'Hint',
        label: 'Label',
    },
};

export const MaxLength: Story = {
    args: {
        placeholder: 'Placeholder',
        rows: 10,
        cols: 30,
        hint: 'Hint',
        label: 'Label',
        maxLength: 100,
    },
};

export const Optional: Story = {
    args: {
        placeholder: 'Placeholder',
        rows: 4,
        cols: 50,
        label: 'Label',
        hint: 'Hint',
    },
}

export const Disabled: Story = {
    args: {
        placeholder: 'Placeholder',
        rows: 4,
        cols: 50,
        hint: 'Hint',
        label: 'Label',
        disabled: true,
    },
};

export const Error: Story = {
    args: {
        placeholder: 'Placeholder',
        rows: 4,
        cols: 50,
        hint: 'Hint',
        label: 'Label',
        error: "some string",
    },
};
