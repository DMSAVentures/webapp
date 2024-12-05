import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Sidebar } from "@/components/simpleui/UIShell/Sidebar/Sidebar";
// import './Sidebar.stories.scss';
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";

// Sidebar Story Wrapper to showcase Persistent Sidebar
const SidebarStoryWrapper: React.FC = () => {
    return (
        <div className="sidebar-story-container" style={{ display: 'grid', gridTemplateColumns: '18rem 1fr'}}>

                <Sidebar>
                    <SidebarContent />
                </Sidebar>
            <div className="sidebar-story-content">
                Main content area for visualization
            </div>
        </div>
    );
};

// Storybook metadata
const meta: Meta = {
    title: "SimpleUI/Sidebar",
    component: Sidebar,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

// Persistent Sidebar story, always open
export const Persistent: Story = {
    render: () => <SidebarStoryWrapper />,
    parameters: {
        docs: {
            description: {
                story: "This is a persistent sidebar, always open on larger screens and without overlay.",
            },
        },
    },
};
