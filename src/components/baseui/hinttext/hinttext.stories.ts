import HintText  from "@/components/baseui/hinttext/hinttext";
import {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";


const meta: Meta = {
    title: 'Components/HintText',
    component: HintText,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        hintText: { control: 'text' },
        state: { control: 'select', options: ['default', 'error', 'disabled', 'hide'] },
    },
    args: { onClick: fn() },
};

export default meta;
type HintTextStory = StoryObj<typeof meta>;

export const Default: HintTextStory = {
    args: {
        hintText: 'Hint Text',
        state: 'default',
    },
};

export const Error: HintTextStory = {
    args: {
        hintText: 'Hint Text',
        state: 'error',
    },
};

export const Disabled: HintTextStory = {
    args: {
        hintText: 'Hint Text',
        state: 'disabled',
    },
};

export const Hide: HintTextStory = {
    args: {
        hintText: 'Hint Text',
        state: 'hide',
    },
};
