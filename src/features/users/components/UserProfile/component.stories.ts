/**
 * UserProfile Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from './component';
import {
  mockWaitlistUsers,
  getMockUserById,
} from '@/mocks/users.mock';
import { getMockRewardsEarnedByUser } from '@/mocks/rewards.mock';

const meta = {
  title: 'Features/Users/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    userId: {
      description: 'User ID to display',
      control: 'text',
    },
    user: {
      description: 'User data',
      control: 'object',
    },
    referredUsers: {
      description: 'Users referred by this user',
      control: 'object',
    },
    rewards: {
      description: 'Rewards earned by user',
      control: 'object',
    },
    onClose: {
      description: 'Close handler',
      action: 'close clicked',
    },
    onSendEmail: {
      description: 'Send email handler',
      action: 'send email clicked',
    },
    onUpdateStatus: {
      description: 'Update status handler',
      action: 'status updated',
    },
    onDelete: {
      description: 'Delete handler',
      action: 'delete clicked',
    },
  },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Get top performer with referrals
const topPerformer = mockWaitlistUsers[0]; // Emma Watson
const topPerformerReferrals = mockWaitlistUsers.filter(
  (u) => u.referredBy === topPerformer.id
);
const topPerformerRewards = getMockRewardsEarnedByUser(topPerformer.id);

/**
 * Top performer with many referrals and rewards
 */
export const TopPerformer: Story = {
  args: {
    userId: topPerformer.id,
    user: topPerformer,
    referredUsers: topPerformerReferrals,
    rewards: topPerformerRewards,
  },
};

/**
 * Second place user
 */
const secondPlace = mockWaitlistUsers[1]; // James Chen
const secondPlaceReferrals = mockWaitlistUsers.filter(
  (u) => u.referredBy === secondPlace.id
);
const secondPlaceRewards = getMockRewardsEarnedByUser(secondPlace.id);

export const SecondPlace: Story = {
  args: {
    userId: secondPlace.id,
    user: secondPlace,
    referredUsers: secondPlaceReferrals,
    rewards: secondPlaceRewards,
  },
};

/**
 * Pending user waiting for verification
 */
const pendingUser = mockWaitlistUsers.find((u) => u.status === 'pending');

export const PendingUser: Story = {
  args: {
    userId: pendingUser!.id,
    user: pendingUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === pendingUser!.id),
    rewards: [],
  },
};

/**
 * Active user with moderate activity
 */
const activeUser = mockWaitlistUsers.find((u) => u.status === 'active');
const activeUserReferrals = mockWaitlistUsers.filter(
  (u) => u.referredBy === activeUser!.id
);

export const ActiveUser: Story = {
  args: {
    userId: activeUser!.id,
    user: activeUser!,
    referredUsers: activeUserReferrals,
    rewards: getMockRewardsEarnedByUser(activeUser!.id),
  },
};

/**
 * Rejected user
 */
const rejectedUser = mockWaitlistUsers.find((u) => u.status === 'rejected');

export const RejectedUser: Story = {
  args: {
    userId: rejectedUser!.id,
    user: rejectedUser!,
    referredUsers: [],
    rewards: [],
  },
};

/**
 * Invited user
 */
const invitedUser = mockWaitlistUsers.find((u) => u.status === 'invited');
const invitedUserReferrals = mockWaitlistUsers.filter(
  (u) => u.referredBy === invitedUser!.id
);

export const InvitedUser: Story = {
  args: {
    userId: invitedUser!.id,
    user: invitedUser!,
    referredUsers: invitedUserReferrals,
    rewards: getMockRewardsEarnedByUser(invitedUser!.id),
  },
};

/**
 * User without name
 */
export const NoName: Story = {
  args: {
    userId: rejectedUser!.id,
    user: rejectedUser!,
    referredUsers: [],
    rewards: [],
  },
};

/**
 * User without referrals
 */
const userWithoutReferrals = mockWaitlistUsers.find(
  (u) => u.referralCount === 0 && u.status === 'verified'
);

export const NoReferrals: Story = {
  args: {
    userId: userWithoutReferrals!.id,
    user: userWithoutReferrals!,
    referredUsers: [],
    rewards: [],
  },
};

/**
 * User without rewards
 */
export const NoRewards: Story = {
  args: {
    userId: pendingUser!.id,
    user: pendingUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === pendingUser!.id),
    rewards: [],
  },
};

/**
 * User with extensive UTM data
 */
const userWithUTM = mockWaitlistUsers.find(
  (u) => u.utmParams && Object.keys(u.utmParams).length > 2
);

export const WithUTMData: Story = {
  args: {
    userId: userWithUTM!.id,
    user: userWithUTM!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === userWithUTM!.id),
    rewards: getMockRewardsEarnedByUser(userWithUTM!.id),
  },
};

/**
 * Mobile user from referral
 */
const mobileUser = mockWaitlistUsers.find(
  (u) => u.metadata.device === 'mobile' && u.source === 'referral'
);

export const MobileReferral: Story = {
  args: {
    userId: mobileUser!.id,
    user: mobileUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === mobileUser!.id),
    rewards: [],
  },
};

/**
 * Desktop user from social media
 */
const desktopSocialUser = mockWaitlistUsers.find(
  (u) =>
    u.metadata.device === 'desktop' &&
    (u.source === 'twitter' || u.source === 'facebook' || u.source === 'linkedin')
);

export const DesktopSocial: Story = {
  args: {
    userId: desktopSocialUser!.id,
    user: desktopSocialUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === desktopSocialUser!.id),
    rewards: getMockRewardsEarnedByUser(desktopSocialUser!.id),
  },
};

/**
 * With all action handlers
 */
export const WithActions: Story = {
  args: {
    userId: topPerformer.id,
    user: topPerformer,
    referredUsers: topPerformerReferrals,
    rewards: topPerformerRewards,
    onSendEmail: (userId) => console.log('Send email to:', userId),
    onUpdateStatus: (userId, status) => console.log('Update status:', userId, status),
    onDelete: (userId) => console.log('Delete user:', userId),
  },
};

/**
 * Fitness app user (campaign 2)
 */
const fitnessUser = mockWaitlistUsers.find((u) => u.campaignId === 'campaign-2');

export const FitnessAppUser: Story = {
  args: {
    userId: fitnessUser!.id,
    user: fitnessUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === fitnessUser!.id),
    rewards: getMockRewardsEarnedByUser(fitnessUser!.id),
  },
};

/**
 * AI Writing user (campaign 4)
 */
const aiWritingUser = mockWaitlistUsers.find((u) => u.campaignId === 'campaign-4');

export const AIWritingUser: Story = {
  args: {
    userId: aiWritingUser!.id,
    user: aiWritingUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === aiWritingUser!.id),
    rewards: getMockRewardsEarnedByUser(aiWritingUser!.id),
  },
};

/**
 * International user
 */
const internationalUser = mockWaitlistUsers.find(
  (u) => u.metadata.country && u.metadata.country !== 'United States'
);

export const InternationalUser: Story = {
  args: {
    userId: internationalUser!.id,
    user: internationalUser!,
    referredUsers: mockWaitlistUsers.filter((u) => u.referredBy === internationalUser!.id),
    rewards: [],
  },
};
