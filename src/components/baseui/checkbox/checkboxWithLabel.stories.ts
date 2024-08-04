import CheckboxWithLabel         from "@/components/baseui/checkbox/checkboxWithLabel";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/CheckboxWithLabel',
    component: CheckboxWithLabel,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: {control: 'boolean'},
        checked: {control: 'select', options: ['checked', 'unchecked', 'indeterminate']},
        subLabel: {control: 'boolean'},
        badge: {control: 'boolean'},
        badgeString: {control: 'text'},
        linkButton: {control: 'boolean'},
        editLabel: {control: 'text'},
        editSubLabel: {control: 'text'},
        editDescription: {control: 'text'},
        linkTitle: {control: 'text'},
        linkHref: {control: 'text'},
        flipCheckboxToRight: {control: 'boolean'},
    },
    args: { onClick: fn() },
} satisfies Meta<typeof CheckboxWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallCheckedWithLabel: Story = {
    args: {
        size: 'small',
        disabled: false,
        checked: 'checked',
        subLabel: true,
        badge: true,
        badgeString: 'Badge',
        linkButton: true,
        editLabel: 'Label',
        editSubLabel: 'Sublabel',
        editDescription: 'Description',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
        flipCheckboxToRight: false,
    },
};

export const SmallCheckedWithLabelWithLongDescription: Story = {
    args: {
        size: 'small',
        disabled: false,
        checked: 'checked',
        subLabel: true,
        badge: true,
        badgeString: 'Badge',
        linkButton: true,
        editLabel: 'Email Notifications',
        editSubLabel: 'Priority',
        editDescription: 'Receive email notifications for all priority alerts. This includes alerts for all high and medium priority incidents.',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
        flipCheckboxToRight: false,
    },
};


export const CheckboxDisabledWithLabel: Story = {
    args: {
        size: 'small',
        disabled: true,
        checked: 'checked',
        subLabel: true,
        badge: true,
        badgeString: 'Badge',
        linkButton: true,
        editLabel: 'Label',
        editSubLabel: 'Sublabel',
        editDescription: 'Description',
        linkTitle: 'Link',
        linkHref: 'https://www.google.com',
        flipCheckboxToRight: false,
    },
};
