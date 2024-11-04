import Header from "@/components/simpleui/UIShell/Header/Header";
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import React from "react";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarCollapsible} from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";
import {Sidebar} from "@/components/simpleui/UIShell/Sidebar/Sidebar";
import './shell.scss';

export const UIShellWithCollapsibleNavigation: React.FC = () => {
    const [isLeftNavOpen, setIsLeftNavOpen] = React.useState(false);
    const toggleLeftNav = () => {
        setIsLeftNavOpen((prevState) => !prevState);
    };
    return (
        <div className="shell">
            <Header logo={'DMSA'} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav}/>
            <div className={'shell-container'}>
                    <SidebarCollapsible isOpen={isLeftNavOpen} onClose={toggleLeftNav}>
                        <SidebarContent/>
                    </SidebarCollapsible>
                <div className="grid-wide">
                    <Column sm={4} md={8} lg={2} xlg={2}>
                        Some Content
                    </Column>
                </div>
            </div>
        </div>
    );
}
