import ContentLabel  from "@/components/simpleui/label/contentlabel";
import {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";

const meta: Meta = {
    title: 'SimpleUI/ContentLabel',
    component: ContentLabel,
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
        imageSrc: { control: 'text' },
        centeredImage: { control: 'boolean' },
        description: { control: 'text' },
        linkTitle: { control: 'text' },
        linkHref: { control: 'text' },
    },
} satisfies Meta<typeof ContentLabel>;

export default meta;
type ContentLabelStory = StoryObj<typeof meta>;


export const Default: ContentLabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        description: 'Description',
    },
};

export const Disabled: ContentLabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: true,
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        description: 'Description',
    },
};

export const NoSublabel: ContentLabelStory = {
    args: {
        text: 'Label',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        description: 'Description',
    },
};

export const Required: ContentLabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
        required: true,
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        description: 'Description',
    },
};

export const Link: ContentLabelStory = {
    args: {
        text: 'Label',
        subText: 'Sublabel',
        badgeString: 'Badge',
        badgeColour: 'blue',
        disabled: false,
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        description: 'Description',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
    },
};

