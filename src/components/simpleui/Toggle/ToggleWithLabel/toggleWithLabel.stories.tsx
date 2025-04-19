import {ToggleWithLabel} from "@/components/simpleui/Toggle/ToggleWithLabel/toggleWithLabel";
import {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";

const meta: Meta = {
    title: 'SimpleUI/Toggle/ToggleWithLabel',
    component: ToggleWithLabel,
    argTypes: {
        checked: {control: 'boolean'},
    },
} satisfies Meta<typeof ToggleWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
    const [checked, setChecked] = useState(args.checked);

    const handleChange = () => {
        setChecked(!checked);
    };

    return <ToggleWithLabel {...args} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
    },
};

export const Checked: Story = {
    render: Template.bind({}),
    args: {
        checked: true,
        text: 'Label',
        description: 'Description',
    },
};

export const Disabled: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        disabled: true,
    },
};

export const WithDescriptionAndLink: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        description: 'Description',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
    },
};

export const WithAllProps: Story = {
    render: Template.bind({}),
    args: {
        checked: true,
        text: 'Label',
        description: 'Description',
        subText: 'Subtext',
        badgeString: 'Badge',
        imageSrc: 'https://placehold.co/150',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
    },
};

export const FlipToRight: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        flipCheckboxToRight: true,
    },
};
