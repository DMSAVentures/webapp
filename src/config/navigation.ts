import { NavGroup } from '@/types/navigation';

/**
 * Navigation configuration based on user personas
 * Each group defines which personas can access which features
 */
export const navigationConfig: NavGroup[] = [
	{
		label: 'Dashboard',
		allowedPersonas: ['admin', 'marketing', 'developer', 'sales', 'content_creator'],
		items: [
			{
				label: 'Home',
				href: '/',
				iconClass: 'home-line',
				allowedPersonas: ['admin', 'marketing', 'developer', 'sales', 'content_creator', 'viewer'],
			},
		],
	},
	{
		label: 'Marketing',
		allowedPersonas: ['admin', 'marketing'],
		items: [
			{
				label: 'Analytics',
				href: '/analytics',
				iconClass: 'bar-chart-line',
				allowedPersonas: ['admin', 'marketing', 'sales'],
			},
			{
				label: 'Campaigns',
				href: '/campaigns',
				iconClass: 'megaphone-line',
				allowedPersonas: ['admin', 'marketing'],
			},
			{
				label: 'Email',
				href: '/email',
				iconClass: 'mail-line',
				allowedPersonas: ['admin', 'marketing'],
			},
		],
	},
	{
		label: 'Sales',
		allowedPersonas: ['admin', 'sales'],
		items: [
			{
				label: 'Deals',
				href: '/deals',
				iconClass: 'money-dollar-circle-line',
				allowedPersonas: ['admin', 'sales'],
			},
			{
				label: 'Contacts',
				href: '/contacts',
				iconClass: 'contacts-line',
				allowedPersonas: ['admin', 'sales'],
			},
		],
	},
	{
		label: 'Content',
		allowedPersonas: ['admin', 'content_creator', 'marketing'],
		items: [
			{
				label: 'Articles',
				href: '/articles',
				iconClass: 'article-line',
				allowedPersonas: ['admin', 'content_creator', 'marketing'],
			},
			{
				label: 'Media Library',
				href: '/media',
				iconClass: 'image-line',
				allowedPersonas: ['admin', 'content_creator', 'marketing'],
			},
		],
	},
	{
		label: 'Developer',
		allowedPersonas: ['admin', 'developer'],
		items: [
			{
				label: 'API Keys',
				href: '/api-keys',
				iconClass: 'key-line',
				allowedPersonas: ['admin', 'developer'],
			},
			{
				label: 'Webhooks',
				href: '/webhooks',
				iconClass: 'webhook-line',
				allowedPersonas: ['admin', 'developer'],
			},
		],
	},
];
