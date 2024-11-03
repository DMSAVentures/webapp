import Header from "@/components/simpleui/UIShell/Header/Header";
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import React from "react";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";
import {SidebarCollapsible} from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";

export const UIShellWithCollapsibleNavigation: React.FC = () => {
    const [isLeftNavOpen, setIsLeftNavOpen] = React.useState(false);
    const toggleLeftNav = () => {
        setIsLeftNavOpen((prevState) => !prevState);
    };
    return (
        <div className="shell">
            <Header logo={'DMSA'} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav}/>
            <div className={'shell-container'}>
                <SidebarCollapsible isOpen={isLeftNavOpen!} onClose={toggleLeftNav}>
                    <SidebarContent/>
                    <SidebarFooter/>
                </SidebarCollapsible>
                <div className="grid-wide">
                    <Column sm={2} md={2} lg={2} xlg={2}>
                        Some Content
                    </Column>
                </div>
            </div>
        </div>
    );
}
