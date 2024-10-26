import React from 'react'
import "./sidebar.scss"
import Button from "@/components/baseui/button/button";
import {TabMenuVertical} from "@/components/baseui/TabMenu/Vertical/tabMenuVertical";
import {TabMenuVerticalItem} from "@/components/baseui/TabMenu/Vertical/tabMenuVerticalItem";
import Label from "@/components/baseui/label/label";

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar(props: SidebarProps) {
    const items = [ <TabMenuVerticalItem key={1} text={'Personal Details'} active={false} leftIcon={'ri-menu-fold-line'} />,
        <TabMenuVerticalItem key={2} text="Experience" active={true}  leftIcon={'ri-menu-fold-line'}/>,
        <TabMenuVerticalItem key={3} text="References" active={false} leftIcon={'ri-menu-fold-line'} />];

    return (
        <>
            <div className={`sidebar-overlay ${props.isOpen ? 'visible' : ''}`} onClick={props.onClose}/>
            <aside className={`sidebar ${props.isOpen ? 'open' : ''}`}>
                <nav className={'sidebar-nav'}>
                    <div className={'sidebar-header'}>
                        <Label text={'Shubhanshu'}/>
                        <Button onClick={props.onClose} variant={'neutral'} styleType={'ghost'}
                                leftIcon={<i className={'ri-menu-fold-line'}/>} onlyIcon={true}
                                size={'2x-small'}>Close</Button>
                    </div>
                    <TabMenuVertical items={items} title={"Menu"} variant={'default'}/>
                    <TabMenuVertical items={items} title={"Settings"} variant={'default'} showFooter={true}/>
                </nav>
            </aside>
        </>
    )
}
