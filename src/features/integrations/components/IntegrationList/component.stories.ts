import type { Meta, StoryObj } from "@storybook/react";
import type { Integration } from "@/types/common.types";
import { IntegrationList } from "./component";

// Mock integrations data
const mockIntegrations: Integration[] = [
	{
		id: "1",
		name: "Zapier",
		type: "zapier",
		status: "connected",
		config: {},
		lastSyncedAt: new Date("2025-11-01"),
		createdAt: new Date("2025-10-15"),
	},
	{
		id: "2",
		name: "Webhooks",
		type: "webhook",
		status: "connected",
		config: {},
		lastSyncedAt: new Date("2025-11-05"),
		createdAt: new Date("2025-10-20"),
	},
	{
		id: "3",
		name: "Mailchimp",
		type: "mailchimp",
		status: "disconnected",
		config: {},
		createdAt: new Date("2025-10-10"),
	},
	{
		id: "4",
		name: "HubSpot",
		type: "hubspot",
		status: "disconnected",
		config: {},
		createdAt: new Date("2025-09-25"),
	},
	{
		id: "5",
		name: "Salesforce",
		type: "salesforce",
		status: "error",
		config: {},
		lastSyncedAt: new Date("2025-10-28"),
		createdAt: new Date("2025-08-15"),
	},
	{
		id: "6",
		name: "Google Analytics",
		type: "google_analytics",
		status: "connected",
		config: {},
		lastSyncedAt: new Date("2025-11-06"),
		createdAt: new Date("2025-09-01"),
	},
	{
		id: "7",
		name: "Facebook Pixel",
		type: "facebook_pixel",
		status: "disconnected",
		config: {},
		createdAt: new Date("2025-10-05"),
	},
	{
		id: "8",
		name: "Custom Integration",
		type: "custom",
		status: "disconnected",
		config: {},
		createdAt: new Date("2025-10-12"),
	},
];

const meta = {
	title: "Features/Integrations/IntegrationList",
	component: IntegrationList,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		onConnect: { action: "connect" },
		onConfigure: { action: "configure" },
		onDisconnect: { action: "disconnect" },
	},
} satisfies Meta<typeof IntegrationList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default integration list with multiple integrations
 */
export const Default: Story = {
	args: {
		integrations: mockIntegrations,
	},
};

/**
 * Loading state with skeleton cards
 */
export const Loading: Story = {
	args: {
		integrations: mockIntegrations,
		loading: true,
	},
};

/**
 * Empty state with no integrations
 */
export const Empty: Story = {
	args: {
		integrations: [],
	},
};

/**
 * Only connected integrations
 */
export const OnlyConnected: Story = {
	args: {
		integrations: mockIntegrations.filter((i) => i.status === "connected"),
	},
};

/**
 * Only disconnected integrations
 */
export const OnlyDisconnected: Story = {
	args: {
		integrations: mockIntegrations.filter((i) => i.status === "disconnected"),
	},
};

/**
 * Integration with errors
 */
export const WithErrors: Story = {
	args: {
		integrations: mockIntegrations.filter((i) => i.status === "error"),
	},
};
