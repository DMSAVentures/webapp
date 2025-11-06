import type { Meta, StoryObj } from '@storybook/react';
import { ShareButtons } from './component';

const meta = {
    title: 'Features/Referrals/ShareButtons',
    component: ShareButtons,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        referralUrl: {
            control: 'text',
            description: 'The referral URL to share',
        },
        message: {
            control: 'text',
            description: 'Custom message to share (optimized per platform)',
        },
        onShare: {
            action: 'shared',
            description: 'Callback fired when a share button is clicked',
        },
        layout: {
            control: 'select',
            options: ['horizontal', 'vertical', 'grid'],
            description: 'Layout variant',
        },
    },
} satisfies Meta<typeof ShareButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ShareButtons with grid layout
 */
export const Default: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        message: 'Join me on this amazing platform!',
    },
};

/**
 * ShareButtons with custom message
 */
export const CustomMessage: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        message: '🚀 I just joined this awesome waitlist! Join me and move up the list together!',
    },
};

/**
 * ShareButtons in horizontal layout
 */
export const HorizontalLayout: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        layout: 'horizontal',
    },
};

/**
 * ShareButtons in vertical layout
 */
export const VerticalLayout: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        layout: 'vertical',
    },
};

/**
 * ShareButtons in grid layout (default)
 */
export const GridLayout: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        layout: 'grid',
    },
};

/**
 * ShareButtons on mobile view
 */
export const MobileView: Story = {
    args: {
        referralUrl: 'https://example.com?ref=USER123ABC',
        message: 'Check out this amazing platform!',
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};

/**
 * ShareButtons with short URL
 */
export const ShortUrl: Story = {
    args: {
        referralUrl: 'https://ex.co/r/ABC',
        message: 'Join me!',
    },
};

/**
 * ShareButtons with long URL
 */
export const LongUrl: Story = {
    args: {
        referralUrl: 'https://my-very-long-subdomain.example-waitlist-platform.com/campaign/summer-2024?ref=VERYLONGREFERRALCODE123456789',
        message: 'Join me on this incredible journey! This platform is amazing and I think you will love it too.',
    },
};
