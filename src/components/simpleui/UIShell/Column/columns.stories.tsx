import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {Column} from './Column';

const meta: Meta<typeof Column> = {
    title: 'SimpleUI/Column',
    component: Column,
    argTypes: {
        sm: {
            control: { type: 'number', min: 1, max: 4 },
            description: 'Number of columns to span on small screens (up to 4 columns)',
        },
        md: {
            control: { type: 'number', min: 1, max: 8 },
            description: 'Number of columns to span on medium screens (up to 8 columns)',
        },
        lg: {
            control: { type: 'number', min: 1, max: 16 },
            description: 'Number of columns to span on large screens (up to 16 columns)',
        },
        xlg: {
            control: { type: 'number', min: 1, max: 16 },
            description: 'Number of columns to span on extra-large screens (up to 16 columns)',
        },
        max: {
            control: { type: 'number', min: 1, max: 16 },
            description: 'Number of columns to span on max screens (up to 16 columns)',
        },
    },
    args: {
        sm: 2,
        md: 4,
        lg: 8,
        xlg: 8,
        max: 8,
    },
};

export default meta;
type Story = StoryObj<typeof Column>;

// Helper component to wrap columns in a grid container
const GridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="grid-wide" style={{backgroundColor: 'papayawhip'}}>{children}</div>;
};

// Individual stories

// Default Column
export const DefaultColumn: Story = {
    render: (args) => (
        <GridContainer>
            <Column {...args}>Responsive Column</Column>
        </GridContainer>
    ),
};

// Multiple Columns with Different Spans
export const MultipleColumns: Story = {
    render: () => (
        <GridContainer>
            <Column sm={2} md={4} lg={6} xlg={8}>Column 1</Column>
            <Column sm={2} md={4} lg={4} xlg={6}>Column 2</Column>
            <Column sm={4} md={4} lg={6} xlg={2}>Column 3</Column>
            <Column sm={4} md={4} lg={2} xlg={4}>Column 4</Column>
        </GridContainer>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Displays multiple columns with varying spans across breakpoints, showcasing how each `Column` adapts to different screen sizes.',
            },
        },
    },
};

// Columns Spanning Full Width at Different Breakpoints
export const FullWidthColumns: Story = {
    render: () => (
        <GridContainer>
            <Column sm={4} md={8} lg={16} xlg={16}>Full Width on Large Screens</Column>
            <Column sm={4} md={8} lg={16} xlg={16}>Full Width on Large Screens</Column>
        </GridContainer>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Two columns spanning the full width on larger screens, useful for sections that need 100% width at certain breakpoints.',
            },
        },
    },
};

// Columns with Different Spans for Narrow Grid
export const NarrowGridColumns: Story = {
    render: () => (
        <div className="grid-narrow">
            <Column sm={2} md={3} lg={4} xlg={5}>Narrow Column 1</Column>
            <Column sm={2} md={3} lg={4} xlg={5}>Narrow Column 2</Column>
            <Column sm={2} md={3} lg={4} xlg={5}>Narrow Column 3</Column>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Columns within a narrower grid, useful for layouts with a smaller gutter.',
            },
        },
    },
};
