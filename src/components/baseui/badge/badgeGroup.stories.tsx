import {BadgeGroup} from "@/components/baseui/badge/badgeGroup";
import {Meta, StoryObj} from "@storybook/react";
import {Badge} from "@/components/baseui/badge/badge";

const meta: Meta = {
    title: 'Components/Badge Group',
    component: BadgeGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof BadgeGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: [
            <Badge styleType={'filled'} size={'small'} variant={"green"} text={"Badge 1"}/>,
            <Badge styleType={'filled'} size={'small'} variant={"blue"} text={"Badge 2"}/>,
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 3"}/>,
            <Badge styleType={'filled'} size={'small'} variant={"red"} text={"Badge 4"}/>,
        ],
    },
}
