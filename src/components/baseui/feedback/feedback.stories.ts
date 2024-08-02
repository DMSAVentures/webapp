import Feedback     from "@/components/baseui/feedback/feedback";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';


const meta: Meta = {
    title: 'Components/Feedback',
    component: Feedback,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        feedbackType: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info', 'feature'],
        },
        variant: {
            control: 'select',
            options: ['filled', 'light', 'lighter', 'stroke'],
        },
        size: {
            control: 'select',
            options: ['x-small', 'small', 'large'],
        },
        dismissable: {
            control: 'boolean',
        },
        alertTitle: {
            control: 'text',
        },
        linkTitle: {
            control: 'text',
        },
        linkHref: {
            control: 'text',
        },
        alertDescription: {
            control: 'text',
        },
        secondaryLinkTitle: {
            control: 'text',
        },
        secondaryLinkHref: {
            control: 'text',
        },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Filled: Story = {
    args: {
        feedbackType: 'success',
        variant: 'filled',
        size: 'small',
        dismissable: false,
        alertTitle: 'Success',
        alertDescription: 'This is a success message',
        linkTitle: 'Learn more',
        linkHref: 'https://www.google.com',
    },
};

export const Light: Story = {
    args: {
        feedbackType: 'error',
        variant: 'light',
        size: 'small',
        dismissable: true,
        alertTitle: 'Error',
        alertDescription: 'This is an error message',
        linkTitle: 'Learn more',
        linkHref: 'https://www.google.com',
    },
};

export const Lighter: Story = {
    args: {
        feedbackType: 'warning',
        variant: 'lighter',
        size: 'small',
        dismissable: false,
        alertTitle: 'Warning',
        alertDescription: 'This is a warning message',
        linkTitle: 'Learn more',
        linkHref: 'https://www.google.com',
    },
};

export const Stroke: Story = {
    args: {
        feedbackType: 'info',
        variant: 'stroke',
        size: 'small',
        dismissable: true,
        alertTitle: 'Info',
        alertDescription: 'This is an info message',
        linkTitle: 'Learn more',
        linkHref: 'https://www.google.com',
    },
};
