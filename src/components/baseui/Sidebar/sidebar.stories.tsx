import Sidebar, {SidebarProps} from "@/components/baseui/Sidebar/sidebar";
import {Meta, StoryObj} from "@storybook/react";
import React, {useState} from "react";

const SidebarStoryWrapper: React.FC<SidebarProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Open Sidebar</button>
            <Sidebar {...props} isOpen={isOpen} onClose={handleClose} />
        </div>
    );
};

const meta: Meta = {
    title: "Components/Sidebar",
    component: SidebarStoryWrapper,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        isOpen: {control: "boolean"},
        onClose: {action: "closed"},
    },
    args: {
        isOpen: false,
    },

} satisfies Meta<typeof Sidebar>;
export default meta;

type Story = StoryObj<typeof meta>;



export const Open: Story = {
    args: {
        isOpen: true,
    },
};

