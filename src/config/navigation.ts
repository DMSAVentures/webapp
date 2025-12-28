import { NavGroup } from "@/types/navigation";

/**
 * Navigation configuration based on user personas
 * Each group defines which personas can access which features
 */
export const navigationConfig: NavGroup[] = [
	{
		label: "Marketing",
		allowedPersonas: ["admin", "marketing"],
		items: [
			{
				label: "Campaigns",
				href: "/campaigns",
				iconClass: "megaphone-line",
				allowedPersonas: ["admin", "marketing"],
			},
			{
				label: "Email Templates",
				href: "/email-templates",
				iconClass: "mail-line",
				allowedPersonas: ["admin", "marketing"],
			},
			{
				label: "Analytics",
				href: "/analytics",
				iconClass: "bar-chart-line",
				allowedPersonas: ["admin", "marketing"],
			},
		],
	},
	{
		label: "Developer",
		allowedPersonas: ["admin", "developer"],
		items: [
			{
				label: "Webhooks",
				href: "/webhooks",
				iconClass: "webhook-line",
				allowedPersonas: ["admin", "developer"],
			},
			{
				label: "Integrations",
				href: "/integrations",
				iconClass: "plug-line",
				allowedPersonas: ["admin", "developer"],
			},
		],
	},
];
