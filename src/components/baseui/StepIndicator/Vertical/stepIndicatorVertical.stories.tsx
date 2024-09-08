import StepIndicatorVertical  from "@/components/baseui/StepIndicator/Vertical/stepIndicatorVertical";
import StepIndicatorVerticalItem  from "@/components/baseui/StepIndicator/Vertical/stepIndicatorItem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/StepIndicator Vertical',
    component: StepIndicatorVertical,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
        title: { control: 'text' },
    },
} satisfies Meta<typeof StepIndicatorVertical>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {
        items: [
            <StepIndicatorVerticalItem key={1} idx={1} text={'Personal Details'} state={'completed'}/>,
            <StepIndicatorVerticalItem key={2} idx={2} text="Experience" state={'active'} />,
            <StepIndicatorVerticalItem key={3} idx={3} text="References" state={'default'} />,
        ],
        title: 'Step Indicator Vertical',
    },
};

export const Secondary: Story = {
    args: {
        items: [
            <StepIndicatorVerticalItem key={1} idx={1} text="Experience" state={'active'} />,
            <StepIndicatorVerticalItem key={2} idx={2} text="References" state={'default'} />,
            <StepIndicatorVerticalItem key={3} idx={3} text="Certifications" state={'default'} />,
            <StepIndicatorVerticalItem key={4} idx={4} text="Summary" state={'default'} />,
        ],
        title: 'Step Indicator Vertical',
    },
};
