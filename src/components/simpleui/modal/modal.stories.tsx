import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';
import HintText from "@/components/simpleui/hinttext/hinttext";

import React, { useState } from 'react';
import Modal, { ModalProps } from "@/components/simpleui/modal/modal";

const ModalStoryWrapper: React.FC<ModalProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Open Modal</button>
            <Modal {...props} isOpen={isOpen} onClose={handleClose} />
        </div>
    );
};

const meta: Meta = {
    title: 'SimpleUI/Modal',
    component: ModalStoryWrapper,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        title: { control: 'text' },
        onClose: { action: 'closed' },
        icon: { control: 'select', options: ['success', 'error', 'warning', 'info', 'feature'] },
        footerLeftChildren: { control: 'object' },
        footerFullWithButtons: { control: 'boolean' },
        description: { control: 'text' },
        onCancel: { action: 'cancel' },
        onProceed: { action: 'proceed' },
        cancelText: { control: 'text' },
        proceedText: { control: 'text' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof ModalStoryWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;


export const SuccessModal: Story = {
    render: (args: any) => <ModalStoryWrapper {...args} />,
    args: {
        title: 'Title',
        icon: 'success',
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};
export const SuccessWithDescriptionModal: Story = {
    render: (args: any) => <ModalStoryWrapper {...args} />,
    args: {
        title: 'Title',
        icon: 'success',
        description: "This is a long description for the modal box where all tha content is going to fit and this should not expand.",
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const ErrorModal: Story = {
    render: (args: any) => <ModalStoryWrapper {...args} />,
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
    render: (args: any) => <ModalStoryWrapper {...args} />,
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
    render: (args: any) => <ModalStoryWrapper {...args} />,
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
    render: (args: any) => <ModalStoryWrapper {...args} />,
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
        footerLeftChildren: <HintText hintText={'Terms and conditions apply'} state={'default'}/>,
        footerFullWithButtons: false,
        onCancel: fn(),
        onProceed: fn(),
        cancelText: 'Cancel',
        proceedText: 'Proceed',
    },
};

export const ModalWithInfoTitleDescriptionOnly: Story = {
    args: {
        isOpen: true,
        title: "Payment Received",
        icon: "success",
        description: "Description",
        proceedText: "Proceed"
    }
};

