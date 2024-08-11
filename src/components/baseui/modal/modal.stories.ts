import Modal from "@/components/baseui/modal/modal";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: { control: 'boolean' },
        title: { control: 'text' },
        onClose: { action: 'closed' },
        icon: { control: 'select', options: ['success', 'error', 'warning', 'info', 'feature']}
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;


export const SuccessModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'success',
    },
};
export const SuccessWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'success',
        description: 'Description',
    },
};

export const ErrorModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'error',
    },
};

export const ErrorWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'error',
        description: 'Description',
    },
};

export const FeatureModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'feature',
    },
};

export const FeatureWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'feature',
        description: 'Description',
    },
};

export const WarningWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'warning',
        description: 'Description',
    },
};

export const WarningModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'warning',
    },
};

export const InfoModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'info',
    },
};


export const InfoWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'info',
        description: 'Description',
    },
};


export const ModalWithoutIcon: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        description: 'Description',
    },
};



