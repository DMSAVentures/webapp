import type { Meta, StoryObj } from '@storybook/react';
import { CampaignFormPreview } from './component';
import type { Campaign } from '@/types/campaign';

const mockCampaign: Campaign = {
	id: 'campaign-123',
	account_id: 'account-456',
	name: 'Product Launch Waitlist',
	slug: 'product-launch',
	type: 'waitlist',
	status: 'active',
	description: 'Join our product launch waitlist',
	total_signups: 150,
	total_verified: 120,
	total_referrals: 45,
	created_at: new Date('2024-01-01'),
	updated_at: new Date('2024-01-15'),
	form_config: {
		fields: [
			{
				name: 'email',
				type: 'email',
				label: 'Email Address',
				placeholder: 'you@example.com',
				required: true,
			},
			{
				name: 'firstName',
				type: 'text',
				label: 'First Name',
				placeholder: 'John',
				required: true,
			},
			{
				name: 'company',
				type: 'text',
				label: 'Company',
				placeholder: 'Acme Inc.',
				required: false,
			},
		],
		captcha_enabled: false,
		double_opt_in: true,
		custom_css: '__DESIGN__:{"layout":"single-column","colors":{"primary":"#3b82f6","background":"#ffffff","text":"#1f2937","border":"#e5e7eb","error":"#ef4444","success":"#10b981"},"typography":{"fontFamily":"Inter, system-ui, sans-serif","fontSize":16,"fontWeight":400},"spacing":{"padding":16,"gap":16},"borderRadius":8,"customCss":""}',
	},
};

const meta = {
	title: 'Features/Campaigns/CampaignFormPreview',
	component: CampaignFormPreview,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
	},
} satisfies Meta<typeof CampaignFormPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		campaign: mockCampaign,
	},
};

export const TwoColumnLayout: Story = {
	args: {
		campaign: {
			...mockCampaign,
			form_config: {
				...mockCampaign.form_config!,
				custom_css: '__DESIGN__:{"layout":"two-column","colors":{"primary":"#8b5cf6","background":"#ffffff","text":"#1f2937","border":"#e5e7eb","error":"#ef4444","success":"#10b981"},"typography":{"fontFamily":"Inter, system-ui, sans-serif","fontSize":16,"fontWeight":400},"spacing":{"padding":16,"gap":16},"borderRadius":8,"customCss":""}',
			},
		},
	},
};

export const CustomColors: Story = {
	args: {
		campaign: {
			...mockCampaign,
			form_config: {
				...mockCampaign.form_config!,
				custom_css: '__DESIGN__:{"layout":"single-column","colors":{"primary":"#ec4899","background":"#fdf2f8","text":"#831843","border":"#fbcfe8","error":"#be123c","success":"#15803d"},"typography":{"fontFamily":"Inter, system-ui, sans-serif","fontSize":16,"fontWeight":400},"spacing":{"padding":20,"gap":20},"borderRadius":12,"customCss":""}',
			},
		},
	},
};
