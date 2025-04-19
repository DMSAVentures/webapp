import {ToggleCard} from '@/components/simpleui/Toggle/ToggleCard/toggleCard';
import {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";

const meta: Meta = {
    title: 'SimpleUI/Toggle/ToggleCard',
    component: ToggleCard,
    argTypes: {
        checked: {control: 'boolean'},
    },
} satisfies Meta<typeof ToggleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
    const [checked, setChecked] = useState(args.checked);

    const handleChange = () => {
        setChecked(!checked);
    };

    return <ToggleCard {...args} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
    },
};

export const Checked: Story = {
    render: Template.bind({}),
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        disabled: true,
    },
};

export const CheckedDisabled: Story = {
    render: Template.bind({}),
    args: {
        checked: true,
        disabled: true,
    },
};

export const WithLabel: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
    },
};

export const WithBadge: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        badgeString: 'Badge',
    },
};

export const WithSubText: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        subText: 'Subtext',
    },
};

export const WithDescription: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        description: 'Description',
    },
};

export const WithImage: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        imageSrc: 'https://placehold.co/150',
    },
};

export const WithCenteredImage: Story = {
    render: Template.bind({}),
    args: {
        checked: false,
        text: 'Label',
        imageSrc: 'https://placehold.co/150',
        centeredImage: true,
    },
};

export const WithAllProps: Story = {
    render: Template.bind({}),
    args: {
        checked: true,
        text: 'Label',
        badgeString: 'Badge',
        subText: 'Subtext',
        description: 'Description',
        imageSrc: 'https://placehold.co/150',
        flipCheckboxToRight: true,
    },
};
