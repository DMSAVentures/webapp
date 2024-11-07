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
                <div className="grid-wide">
                    <Column sm={{span: 2, start: 7}}>
                            Titles
                    </Column>
                    <Column sm={{span: 1, start: 4}}>
                        Content
                    </Column>
                </div>
            </div>
        </div>
    );
}
