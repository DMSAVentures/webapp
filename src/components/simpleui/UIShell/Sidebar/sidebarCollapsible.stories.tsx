import {SidebarCollapsible, SidebarProps} from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";
import {Meta, StoryObj} from "@storybook/react";
import React, {useState} from "react";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";

const SidebarStoryWrapper: React.FC<SidebarProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Open Sidebar</button>
            <SidebarCollapsible {...props} isOpen={isOpen} onClose={handleClose}>
                <SidebarContent/>
            </SidebarCollapsible>
        </div>
    );
};

const meta: Meta = {
    title: "SimpleUI/SidebarCollapsible",
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

} satisfies Meta<typeof SidebarCollapsible>;
export default meta;

type Story = StoryObj<typeof meta>;



export const Open: Story = {
    args: {
        isOpen: true,
    },
};

