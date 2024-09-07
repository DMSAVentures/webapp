import {TableCell} from "@/components/baseui/Table/TableCell/tableCell";
import {Meta, StoryObj} from "@storybook/react";
import {BadgeGroup} from "@/components/baseui/badge/badgeGroup";
import {Badge} from "@/components/baseui/badge/badge";
import Button from "@/components/baseui/button/button";
import ButtonGroup from "@/components/baseui/buttongroup/buttongroup";
import ProgressBarLine from "@/components/baseui/progressbar/progressbar";

const meta: Meta = {
    title: 'Components/TableCell',
    component: TableCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Table Cell',
    },
}

export const Empty: Story = {
    args: {
    },
}

export const BadgeGroupTableCellMedium: Story = {
    args: {
        children: <BadgeGroup>
            <Badge styleType={'filled'} size={'small'} variant={"green"} text={"Badge 1"}/>
            <Badge styleType={'filled'} size={'small'} variant={"blue"} text={"Badge 2"}/>
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 3"}/>
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 4"}/>
        </BadgeGroup>,
        size: 'medium',
    },
}


export const BadgeGroupTableCellLarge: Story = {
    args: {
        children: <BadgeGroup>
            <Badge styleType={'filled'} size={'small'} variant={"green"} text={"Badge 1"}/>
            <Badge styleType={'filled'} size={'small'} variant={"blue"} text={"Badge 2"}/>
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 3"}/>
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 4"}/>
        </BadgeGroup>,
        size: 'large',
    },
}

export const IconButtonTableCell: Story = {
    args: {
        children: <ButtonGroup noBorder={true} size={'small'} items={[
            {
                icon: "ri-more-2-line",
                iconOnly: true,
                text: "Edit",
                iconPosition: 'left',
                onClick: () => {
                    console.log('Edit clicked');
                }
            },
           ]}/>,
    },
}

export const ButtonGroupTableCell: Story = {
    args: {
        children: <ButtonGroup noBorder={true} size={'small'} items={[
            {
                icon: "ri-pencil-line",
                iconOnly: true,
                text: "Edit",
                iconPosition: 'left',
                onClick: () => {
                    console.log('Edit clicked');
                }
            },
                {
                icon: "ri-pencil-line",
                iconOnly: true,
                text: "Edit",
                iconPosition: 'left',
                onClick: () => {
                    console.log('Edit clicked');
                }
            }]}/>,
    }
}

export const ProgressBarTableCell: Story = {
    args: {
        children: <ProgressBarLine size={"medium"} progress={78} variant={"success"} showPercentage={true}/>,
    },
}
