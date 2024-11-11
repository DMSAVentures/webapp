import HintText  from "@/components/simpleui/hinttext/hinttext";
import {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";


const meta: Meta = {
    title: 'SimpleUI/HintText',
    component: HintText,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        hintText: { control: 'text' },
        state: { control: 'select', options: ['default', 'error', 'disabled'] },
        hide: { control: 'boolean' },
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
        hide: true,
    },
};
