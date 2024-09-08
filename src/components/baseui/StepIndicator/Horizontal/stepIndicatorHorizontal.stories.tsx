import StepIndicatorHorizontal  from "@/components/baseui/StepIndicator/Horizontal/stepIndicatorHorizontal";
import StepIndicatorHorizontalItem  from "@/components/baseui/StepIndicator/Horizontal/stepIndicatorItem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/StepIndicator Horizontal',
    component: StepIndicatorHorizontal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
    },
} satisfies Meta<typeof StepIndicatorHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        items: [
            <StepIndicatorHorizontalItem key={1} idx={1} text={'Personal Details'} state={'completed'}/>,
            <StepIndicatorHorizontalItem key={2} idx={2} text="Experience" state={'active'} />,
            <StepIndicatorHorizontalItem key={3} idx={3} text="References" state={'default'} />,
        ],
    },
};
