import StepIndicatorVertical  from "@/components/baseui/stepindicatorvertical/stepIndicatorVertical";
import StepIndicatorVerticalItem  from "@/components/baseui/stepindicatorvertical/stepIndicatorItem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/StepIndicator Vertical',
    component: StepIndicatorVertical,
    parameters: {
        layout: 'centered',
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
            <StepIndicatorVerticalItem idx={1} text={'Personal Details'} state={'completed'}/>,
            <StepIndicatorVerticalItem idx={2} text="Experience" state={'active'} />,
            <StepIndicatorVerticalItem idx={3} text="References" state={'default'} />,
        ],
        title: 'Step Indicator Vertical',
    },
};

export const Secondary: Story = {
    args: {
        items: [
            <StepIndicatorVerticalItem idx={1} text="Experience" state={'active'} />,
            <StepIndicatorVerticalItem idx={2} text="References" state={'default'} />,
            <StepIndicatorVerticalItem idx={3} text="Certifications" state={'default'} />,
            <StepIndicatorVerticalItem idx={4} text="Summary" state={'default'} />,
        ],
        title: 'Step Indicator Vertical',
    },
};
