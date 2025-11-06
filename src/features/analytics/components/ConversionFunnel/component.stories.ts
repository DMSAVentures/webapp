import type { Meta, StoryObj } from "@storybook/react";
import {
	mockAnalyticsEarlyStage,
	mockAnalyticsHighPerformance,
	mockAnalyticsStruggling,
	mockAnalyticsViral,
} from "@/mocks";
import { ConversionFunnel } from "./component";

const meta = {
	title: "Features/Analytics/ConversionFunnel",
	component: ConversionFunnel,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof ConversionFunnel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default conversion funnel from high-performance campaign
 */
export const Default: Story = {
	args: {
		data: mockAnalyticsHighPerformance.funnel,
	},
};

/**
 * Viral campaign with excellent conversion rates
 */
export const HighConversion: Story = {
	args: {
		data: mockAnalyticsViral.funnel,
	},
};

/**
 * Early stage campaign with typical drop-off
 */
export const EarlyCampaign: Story = {
	args: {
		data: mockAnalyticsEarlyStage.funnel,
	},
};

/**
 * Struggling campaign with significant drop-off
 */
export const LowConversion: Story = {
	args: {
		data: mockAnalyticsStruggling.funnel,
	},
};

/**
 * Perfect funnel for comparison (unrealistic but shows the ideal)
 */
export const PerfectFunnel: Story = {
	args: {
		data: {
			impressions: 10000,
			started: 10000,
			submitted: 10000,
			verified: 10000,
			referred: 10000,
		},
	},
};
