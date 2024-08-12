import Modal from "@/components/baseui/modal/modal";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';
import HintText from "@/components/baseui/hinttext/hinttext";

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
        icon: { control: 'select', options: ['success', 'error', 'warning', 'info', 'feature']},
        footerLeftChildren: { control: 'object' },
        footerFullWithButtons: { control: 'boolean' },
        description: { control: 'text' },
        onCancel: { action: 'cancel' },
        onProceed: { action: 'proceed' },
        cancelText: { control: 'text' },
        proceedText: { control: 'text' },
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
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};
export const SuccessWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'success',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const ErrorModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'error',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const ErrorWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'error',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const FeatureModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'feature',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const FeatureWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'feature',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const WarningWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'warning',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const WarningModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'warning',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const InfoModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'info',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};


export const InfoWithDescriptionModal: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        icon: 'info',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};


export const ModalWithoutIcon: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        description: 'Description',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const ModalWithFooter: Story = {
    args: {
        isOpen: true,
        title: 'Title',
        description: 'Description',
        footerLeftChildren: <HintText hintText={'Footer Left'} state={'default'}/>,
        footerFullWithButtons: false,
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

