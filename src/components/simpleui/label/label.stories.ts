import Label from "@/components/simpleui/label/label";
import {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";

const meta: Meta = {
    title: 'SimpleUI/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        text: { control: 'text' },
        subText: { control: 'text' },
        badgeString: { control: 'text' },
        badgeColour: { control: 'select', options: ['gray', 'blue', 'orange', 'red', 'green', 'purple', 'yellow', 'pink', 'sky', 'teal'] },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
} satisfies Meta<typeof Label>;

export default meta;
type LabelStory = StoryObj<typeof meta>;

export const Default: LabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
    },
};

export const Disabled: LabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: true,
    },
};

export const NoSublabel: LabelStory = {
    args: {
        text: 'Label',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
    },
};

export const Required: LabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
        required: true,
    },
};
