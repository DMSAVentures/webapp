/**
 * UserList Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UserList } from './component';
import {
  mockWaitlistUsers,
  getMockUsersByCampaign,
  mockUsersByStatus,
  mockUsersBySource,
} from '@/mocks/users.mock';

const meta = {
  title: 'Features/Users/UserList',
  component: UserList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    campaignId: {
      description: 'Campaign ID',
      control: 'text',
    },
    users: {
      description: 'Array of waitlist users',
      control: 'object',
    },
    loading: {
      description: 'Show loading state',
      control: 'boolean',
    },
    showFilters: {
      description: 'Show filters panel',
      control: 'boolean',
    },
    onUserClick: {
      description: 'User click handler',
      action: 'user clicked',
    },
    onExport: {
      description: 'Export handler',
      action: 'export clicked',
    },
    onBulkAction: {
      description: 'Bulk action handler',
      action: 'bulk action triggered',
    },
  },
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view with all users
 */
export const Default: Story = {
  args: {
    campaignId: 'campaign-1',
    users: getMockUsersByCampaign('campaign-1'),
    showFilters: true,
  },
};

/**
 * With all mock users
 */
export const AllUsers: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockWaitlistUsers,
    showFilters: true,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    campaignId: 'campaign-1',
    users: [],
    loading: true,
    showFilters: true,
  },
};

/**
 * Empty state (no users)
 */
export const Empty: Story = {
  args: {
    campaignId: 'campaign-1',
    users: [],
    loading: false,
    showFilters: true,
  },
};

/**
 * Without filters
 */
export const NoFilters: Story = {
  args: {
    campaignId: 'campaign-1',
    users: getMockUsersByCampaign('campaign-1'),
    showFilters: false,
  },
};

/**
 * Only verified users
 */
export const VerifiedOnly: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersByStatus.verified,
    showFilters: true,
  },
};

/**
 * Only pending users
 */
export const PendingOnly: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersByStatus.pending,
    showFilters: true,
  },
};

/**
 * Only active users
 */
export const ActiveOnly: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersByStatus.active,
    showFilters: true,
  },
};

/**
 * Only rejected users
 */
export const RejectedOnly: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersByStatus.rejected,
    showFilters: true,
  },
};

/**
 * Referral users only
 */
export const ReferralUsers: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersBySource.referral,
    showFilters: true,
  },
};

/**
 * Twitter users only
 */
export const TwitterUsers: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockUsersBySource.twitter,
    showFilters: true,
  },
};

/**
 * Few users (2)
 */
export const FewUsers: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockWaitlistUsers.slice(0, 2),
    showFilters: true,
  },
};

/**
 * Single user
 */
export const SingleUser: Story = {
  args: {
    campaignId: 'campaign-1',
    users: [mockWaitlistUsers[0]],
    showFilters: true,
  },
};

/**
 * With actions
 */
export const WithActions: Story = {
  args: {
    campaignId: 'campaign-1',
    users: getMockUsersByCampaign('campaign-1'),
    showFilters: true,
    onUserClick: (user) => console.log('User clicked:', user.email),
    onExport: async (userIds) => {
      console.log('Export users:', userIds);
      return Promise.resolve();
    },
    onBulkAction: async (action, userIds) => {
      console.log('Bulk action:', action, userIds);
      return Promise.resolve();
    },
  },
};

/**
 * Fitness app campaign users
 */
export const FitnessApp: Story = {
  args: {
    campaignId: 'campaign-2',
    users: getMockUsersByCampaign('campaign-2'),
    showFilters: true,
  },
};

/**
 * AI Writing campaign users
 */
export const AIWriting: Story = {
  args: {
    campaignId: 'campaign-4',
    users: getMockUsersByCampaign('campaign-4'),
    showFilters: true,
  },
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockWaitlistUsers.slice(0, 5),
    showFilters: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet responsive view
 */
export const TabletView: Story = {
  args: {
    campaignId: 'campaign-1',
    users: getMockUsersByCampaign('campaign-1'),
    showFilters: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Top performers (high referral counts)
 */
export const TopPerformers: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockWaitlistUsers
      .filter((u) => u.referralCount > 10)
      .sort((a, b) => b.referralCount - a.referralCount),
    showFilters: true,
  },
};

/**
 * Users without referrals
 */
export const NoReferrals: Story = {
  args: {
    campaignId: 'campaign-1',
    users: mockWaitlistUsers.filter((u) => u.referralCount === 0),
    showFilters: true,
  },
};
