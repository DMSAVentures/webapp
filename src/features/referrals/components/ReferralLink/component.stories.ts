import type { Meta, StoryObj } from '@storybook/react';
import { ReferralLink } from './component';

const meta = {
    title: 'Features/Referrals/ReferralLink',
    component: ReferralLink,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        referralCode: {
            control: 'text',
            description: 'The referral code to generate the URL',
        },
        onCopy: {
            action: 'copied',
            description: 'Callback fired when the link is copied',
        },
        baseUrl: {
            control: 'text',
            description: 'Base URL for the referral link',
        },
    },
} satisfies Meta<typeof ReferralLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ReferralLink with a sample referral code
 */
export const Default: Story = {
    args: {
        referralCode: 'USER123ABC',
        baseUrl: 'https://example.com',
    },
};

/**
 * ReferralLink with a short referral code
 */
export const ShortCode: Story = {
    args: {
        referralCode: 'ABC123',
        baseUrl: 'https://example.com',
    },
};

/**
 * ReferralLink with a long referral code
 */
export const LongCode: Story = {
    args: {
        referralCode: 'VERYLONGREFERRALCODE123456789',
        baseUrl: 'https://example.com',
    },
};

/**
 * ReferralLink with a custom base URL
 */
export const CustomBaseUrl: Story = {
    args: {
        referralCode: 'CUSTOM456',
        baseUrl: 'https://my-campaign.app.com',
    },
};

/**
 * ReferralLink with a very long base URL
 */
export const LongBaseUrl: Story = {
    args: {
        referralCode: 'REF789',
        baseUrl: 'https://my-very-long-subdomain.example-waitlist-platform.com/campaign',
    },
};

/**
 * Mobile view of ReferralLink
 */
export const MobileView: Story = {
    args: {
        referralCode: 'MOBILE123',
        baseUrl: 'https://example.com',
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
