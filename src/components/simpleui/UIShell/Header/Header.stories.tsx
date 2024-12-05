import { Meta, StoryObj } from '@storybook/react';
import Header from './Header';
import { NavItem } from './HeaderNav';
import { ActionItem } from './HeaderActions';
import {useState} from "react";

// Define the default export metadata for the Header story
const meta: Meta<typeof Header> = {
    title: 'SimpleUI/Header',
    component: Header,
    tags: ['autodocs'], // Adds automatic documentation generation
    args: {
        logo: 'DMSA', // Default logo text
        isLeftNavOpen: false, // Default closed state for the left navigation
    },
    argTypes: {
        logo: { control: 'text' }, // Controls logo as text input
        isLeftNavOpen: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Header>;

// Example data for navItems and actionItems
const navItems: NavItem[] = [
    { label: 'Link 1', href: '#' },
    { label: 'Link 2', href: '#' },
    { label: 'Link 3', href: '#' },
    {
        label: 'Link 4',
        href: '#',
        subItems: [
            { label: 'Sublink 1', href: '#' },
            { label: 'Sublink 2', href: '#' },
        ],
    },
];

const actionItems: ActionItem[] = [
    { iconClass: 'search-line', label: 'Search', href: '#' },
    {
        iconClass: 'notification-line',
        label: 'Notifications',
        subItems: [
            { label: 'Alert 1', href: '#' },
            { label: 'Alert 2', href: '#' },
        ],
    },
    { iconClass: 'apps-2-line', label: 'Apps' },
];

// Default Header story with toggleLeftNav functionality
export const DefaultHeader: Story = {
    render: (args) => {
        const [isLeftNavOpen, setIsLeftNavOpen] = useState(args.isLeftNavOpen);

        const toggleLeftNav = () => {
            setIsLeftNavOpen((prevState) => !prevState);
        };

        return <Header {...args} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav} />;
    },
    args: {
        navItems,
        actionItems,
    },
};

// Header with custom logo story
export const HeaderWithCustomLogo: Story = {
    render: (args) => {
        const [isLeftNavOpen, setIsLeftNavOpen] = useState(args.isLeftNavOpen);

        const toggleLeftNav = () => {
            setIsLeftNavOpen((prevState) => !prevState);
        };

        return <Header {...args} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav} />;
    },
    args: {
        logo: 'My Custom Logo',
        navItems,
        actionItems,
    },
};

// Header with left nav toggle story
export const HeaderWithLeftNavToggle: Story = {
    render: (args) => {
        const [isLeftNavOpen, setIsLeftNavOpen] = useState(args.isLeftNavOpen);

        const toggleLeftNav = () => {
            setIsLeftNavOpen((prevState) => !prevState);
        };

        return <Header {...args} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav} />;
    },
    args: {
        logo: 'Header with Left Nav',
        navItems,
        actionItems,
        isLeftNavOpen: false,
    },
};
