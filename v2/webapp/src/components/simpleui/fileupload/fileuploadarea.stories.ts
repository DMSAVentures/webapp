import FileUploadArea from "@/components/simpleui/fileupload/fileuploadarea";
import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof FileUploadArea> = {
    title: 'SimpleUI/FileUploadArea',
    component: FileUploadArea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['light', 'gray']
        },
        onFileUpload: { action: 'fileUploaded' }, // Use `action` to simulate function calls in Storybook
    },
} satisfies Meta<typeof FileUploadArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        onFileUpload: action('fileUploaded'), // Use `action` to create a mock function for `onFileUpload`
    },
};
