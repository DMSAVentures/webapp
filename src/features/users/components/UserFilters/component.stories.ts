/**
 * UserFilters Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UserFilters, type UserFiltersType } from './component';

const meta = {
  title: 'Features/Users/UserFilters',
  component: UserFilters,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    filters: {
      description: 'Current filter values',
      control: 'object',
    },
    onChange: {
      description: 'Filter change handler',
      action: 'filters changed',
    },
    onReset: {
      description: 'Reset handler',
      action: 'filters reset',
    },
  },
} satisfies Meta<typeof UserFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty filters
 */
export const Default: Story = {
  args: {
    filters: {},
  },
};

/**
 * Filters with status selected
 */
export const WithStatusFilter: Story = {
  args: {
    filters: {
      status: ['verified', 'active'],
    },
  },
};

/**
 * Filters with date range
 */
export const WithDateRange: Story = {
  args: {
    filters: {
      dateRange: {
        start: new Date('2024-09-01'),
        end: new Date('2024-11-30'),
      },
    },
  },
};

/**
 * Filters with sources selected
 */
export const WithSources: Story = {
  args: {
    filters: {
      source: ['twitter', 'referral', 'linkedin'],
    },
  },
};

/**
 * Filters with has referrals
 */
export const WithHasReferrals: Story = {
  args: {
    filters: {
      hasReferrals: true,
    },
  },
};

/**
 * Filters with position range
 */
export const WithPositionRange: Story = {
  args: {
    filters: {
      minPosition: 1,
      maxPosition: 100,
    },
  },
};

/**
 * All filters applied
 */
export const AllFiltersApplied: Story = {
  args: {
    filters: {
      status: ['verified', 'active'],
      dateRange: {
        start: new Date('2024-09-01'),
        end: new Date('2024-11-30'),
      },
      source: ['twitter', 'referral'],
      hasReferrals: true,
      minPosition: 1,
      maxPosition: 500,
    },
  },
};

/**
 * Pending users only
 */
export const PendingOnly: Story = {
  args: {
    filters: {
      status: ['pending'],
    },
  },
};

/**
 * Top referrers (position 1-10 with referrals)
 */
export const TopReferrers: Story = {
  args: {
    filters: {
      minPosition: 1,
      maxPosition: 10,
      hasReferrals: true,
      status: ['verified', 'active'],
    },
  },
};

/**
 * Recent signups (last 7 days)
 */
export const RecentSignups: Story = {
  args: {
    filters: {
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
  },
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  args: {
    filters: {
      status: ['verified'],
      source: ['referral'],
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
