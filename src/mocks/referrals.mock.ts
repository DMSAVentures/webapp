/**
 * Mock data for Referral and Leaderboard components
 * Used for Storybook stories and testing
 */

import type {
  Referral,
  Leaderboard,
  LeaderboardEntry,
} from '../types/common.types';

// Mock Referrals
export const mockReferrals: Referral[] = [
  // Emma's referrals (top performer)
  {
    id: 'ref-1',
    referrerId: 'wuser-1',
    referredUserId: 'wuser-3',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'link',
    createdAt: new Date('2024-09-25T11:45:00Z'),
    verifiedAt: new Date('2024-09-26T08:30:00Z'),
  },
  {
    id: 'ref-2',
    referrerId: 'wuser-1',
    referredUserId: 'wuser-8',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'whatsapp',
    createdAt: new Date('2024-10-15T07:30:00Z'),
    verifiedAt: new Date('2024-10-15T08:05:00Z'),
  },
  {
    id: 'ref-3',
    referrerId: 'wuser-1',
    referredUserId: 'wuser-20',
    campaignId: 'campaign-1',
    status: 'signed_up',
    source: 'email',
    createdAt: new Date('2024-11-02T14:22:00Z'),
    verifiedAt: undefined,
  },
  {
    id: 'ref-4',
    referrerId: 'wuser-1',
    referredUserId: 'wuser-21',
    campaignId: 'campaign-1',
    status: 'converted',
    source: 'twitter',
    createdAt: new Date('2024-09-18T10:15:00Z'),
    verifiedAt: new Date('2024-09-18T11:00:00Z'),
  },
  {
    id: 'ref-5',
    referrerId: 'wuser-1',
    referredUserId: 'wuser-22',
    campaignId: 'campaign-1',
    status: 'clicked',
    source: 'facebook',
    createdAt: new Date('2024-11-04T16:30:00Z'),
    verifiedAt: undefined,
  },
  // James's referrals
  {
    id: 'ref-6',
    referrerId: 'wuser-2',
    referredUserId: 'wuser-4',
    campaignId: 'campaign-1',
    status: 'converted',
    source: 'email',
    createdAt: new Date('2024-09-20T16:20:00Z'),
    verifiedAt: new Date('2024-09-20T17:05:00Z'),
  },
  {
    id: 'ref-7',
    referrerId: 'wuser-2',
    referredUserId: 'wuser-23',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'linkedin',
    createdAt: new Date('2024-09-28T09:10:00Z'),
    verifiedAt: new Date('2024-09-28T09:45:00Z'),
  },
  {
    id: 'ref-8',
    referrerId: 'wuser-2',
    referredUserId: 'wuser-24',
    campaignId: 'campaign-1',
    status: 'signed_up',
    source: 'link',
    createdAt: new Date('2024-10-12T13:20:00Z'),
    verifiedAt: undefined,
  },
  // Oliver's referrals
  {
    id: 'ref-9',
    referrerId: 'wuser-4',
    referredUserId: 'wuser-10',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'other',
    createdAt: new Date('2024-09-28T11:20:00Z'),
    verifiedAt: new Date('2024-09-28T11:55:00Z'),
  },
  {
    id: 'ref-10',
    referrerId: 'wuser-4',
    referredUserId: 'wuser-25',
    campaignId: 'campaign-1',
    status: 'clicked',
    source: 'link',
    createdAt: new Date('2024-10-30T15:40:00Z'),
    verifiedAt: undefined,
  },
  // Isabella's referrals
  {
    id: 'ref-11',
    referrerId: 'wuser-6',
    referredUserId: 'wuser-7',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'whatsapp',
    createdAt: new Date('2024-10-08T13:42:00Z'),
    verifiedAt: new Date('2024-10-08T14:10:00Z'),
  },
  {
    id: 'ref-12',
    referrerId: 'wuser-6',
    referredUserId: 'wuser-26',
    campaignId: 'campaign-1',
    status: 'signed_up',
    source: 'linkedin',
    createdAt: new Date('2024-10-22T11:30:00Z'),
    verifiedAt: undefined,
  },
  // David Kim's referrals
  {
    id: 'ref-13',
    referrerId: 'wuser-15',
    referredUserId: 'wuser-27',
    campaignId: 'campaign-1',
    status: 'converted',
    source: 'email',
    createdAt: new Date('2024-09-25T14:00:00Z'),
    verifiedAt: new Date('2024-09-25T15:30:00Z'),
  },
  {
    id: 'ref-14',
    referrerId: 'wuser-15',
    referredUserId: 'wuser-28',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'link',
    createdAt: new Date('2024-10-03T10:20:00Z'),
    verifiedAt: new Date('2024-10-03T11:05:00Z'),
  },
  // Priya's referrals
  {
    id: 'ref-15',
    referrerId: 'wuser-10',
    referredUserId: 'wuser-29',
    campaignId: 'campaign-1',
    status: 'verified',
    source: 'other',
    createdAt: new Date('2024-10-05T08:15:00Z'),
    verifiedAt: new Date('2024-10-05T09:00:00Z'),
  },
  {
    id: 'ref-16',
    referrerId: 'wuser-10',
    referredUserId: 'wuser-30',
    campaignId: 'campaign-1',
    status: 'signed_up',
    source: 'whatsapp',
    createdAt: new Date('2024-10-28T16:45:00Z'),
    verifiedAt: undefined,
  },
  // Campaign 2 referrals (Mobile App)
  {
    id: 'ref-17',
    referrerId: 'wuser-12',
    referredUserId: 'wuser-11',
    campaignId: 'campaign-2',
    status: 'converted',
    source: 'instagram',
    createdAt: new Date('2024-10-21T06:30:00Z'),
    verifiedAt: new Date('2024-10-21T06:45:00Z'),
  },
  {
    id: 'ref-18',
    referrerId: 'wuser-12',
    referredUserId: 'wuser-31',
    campaignId: 'campaign-2',
    status: 'verified',
    source: 'link',
    createdAt: new Date('2024-10-23T09:00:00Z'),
    verifiedAt: new Date('2024-10-23T09:30:00Z'),
  },
  {
    id: 'ref-19',
    referrerId: 'wuser-11',
    referredUserId: 'wuser-32',
    campaignId: 'campaign-2',
    status: 'signed_up',
    source: 'whatsapp',
    createdAt: new Date('2024-10-25T14:20:00Z'),
    verifiedAt: undefined,
  },
  // Campaign 4 referrals (AI Writing)
  {
    id: 'ref-20',
    referrerId: 'wuser-13',
    referredUserId: 'wuser-14',
    campaignId: 'campaign-4',
    status: 'converted',
    source: 'twitter',
    createdAt: new Date('2024-08-15T14:22:00Z'),
    verifiedAt: new Date('2024-08-15T14:30:00Z'),
  },
  {
    id: 'ref-21',
    referrerId: 'wuser-13',
    referredUserId: 'wuser-33',
    campaignId: 'campaign-4',
    status: 'verified',
    source: 'facebook',
    createdAt: new Date('2024-08-20T11:00:00Z'),
    verifiedAt: new Date('2024-08-20T11:25:00Z'),
  },
  {
    id: 'ref-22',
    referrerId: 'wuser-13',
    referredUserId: 'wuser-34',
    campaignId: 'campaign-4',
    status: 'verified',
    source: 'linkedin',
    createdAt: new Date('2024-08-25T15:30:00Z'),
    verifiedAt: new Date('2024-08-25T16:00:00Z'),
  },
  {
    id: 'ref-23',
    referrerId: 'wuser-14',
    referredUserId: 'wuser-35',
    campaignId: 'campaign-4',
    status: 'clicked',
    source: 'email',
    createdAt: new Date('2024-09-02T10:15:00Z'),
    verifiedAt: undefined,
  },
];

// Helper functions
export const getMockReferralById = (id: string): Referral | undefined => {
  return mockReferrals.find((referral) => referral.id === id);
};

export const getMockReferralsByCampaign = (campaignId: string): Referral[] => {
  return mockReferrals.filter((referral) => referral.campaignId === campaignId);
};

export const getMockReferralsByReferrer = (referrerId: string): Referral[] => {
  return mockReferrals.filter((referral) => referral.referrerId === referrerId);
};

export const getMockReferralsByStatus = (
  status: Referral['status']
): Referral[] => {
  return mockReferrals.filter((referral) => referral.status === status);
};

export const getMockReferralsBySource = (
  source: Referral['source']
): Referral[] => {
  return mockReferrals.filter((referral) => referral.source === source);
};

// Mock Leaderboard Entries
export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'wuser-1',
    name: 'Emma Watson',
    referralCount: 47,
    points: 235,
    badges: ['top_referrer', 'early_bird', 'super_sharer'],
  },
  {
    rank: 2,
    userId: 'wuser-2',
    name: 'James Chen',
    referralCount: 32,
    points: 180,
    badges: ['early_bird', 'consistent'],
  },
  {
    rank: 3,
    userId: 'wuser-13',
    name: 'Alex Rivera',
    referralCount: 56,
    points: 295,
    badges: ['top_referrer', 'influencer', 'super_sharer', 'verified'],
  },
  {
    rank: 4,
    userId: 'wuser-14',
    name: 'Jessica Park',
    referralCount: 34,
    points: 185,
    badges: ['influencer', 'consistent'],
  },
  {
    rank: 5,
    userId: 'wuser-12',
    name: 'Sarah Thompson',
    referralCount: 28,
    points: 150,
    badges: ['early_bird', 'super_sharer'],
  },
  {
    rank: 6,
    userId: 'wuser-15',
    name: 'David Kim',
    referralCount: 22,
    points: 120,
    badges: ['consistent'],
  },
  {
    rank: 7,
    userId: 'wuser-4',
    name: 'Oliver Brown',
    referralCount: 18,
    points: 95,
    badges: ['rising_star'],
  },
  {
    rank: 8,
    userId: 'wuser-11',
    name: 'Marcus Johnson',
    referralCount: 15,
    points: 85,
    badges: ['rising_star'],
  },
  {
    rank: 9,
    userId: 'wuser-10',
    name: 'Priya Patel',
    referralCount: 12,
    points: 68,
    badges: ['verified'],
  },
  {
    rank: 10,
    userId: 'wuser-6',
    name: 'Isabella Garcia',
    referralCount: 8,
    points: 48,
    badges: [],
  },
  {
    rank: 11,
    userId: 'wuser-7',
    name: 'Liam Johnson',
    referralCount: 5,
    points: 30,
    badges: [],
  },
  {
    rank: 12,
    userId: 'wuser-3',
    name: 'Sophia Martinez',
    referralCount: 3,
    points: 15,
    badges: [],
  },
  {
    rank: 13,
    userId: 'wuser-8',
    name: 'Ava Lee',
    referralCount: 0,
    points: 5,
    badges: [],
  },
];

// Mock Leaderboards
export const mockLeaderboards: Leaderboard[] = [
  {
    campaignId: 'campaign-1',
    period: 'all_time',
    entries: mockLeaderboardEntries.filter((e) => [
      'wuser-1',
      'wuser-2',
      'wuser-15',
      'wuser-4',
      'wuser-10',
      'wuser-6',
      'wuser-7',
      'wuser-3',
      'wuser-8',
    ].includes(e.userId)),
  },
  {
    campaignId: 'campaign-1',
    period: 'weekly',
    entries: [
      {
        rank: 1,
        userId: 'wuser-1',
        name: 'Emma Watson',
        referralCount: 8,
        points: 42,
        badges: ['weekly_winner'],
      },
      {
        rank: 2,
        userId: 'wuser-15',
        name: 'David Kim',
        referralCount: 5,
        points: 28,
        badges: [],
      },
      {
        rank: 3,
        userId: 'wuser-10',
        name: 'Priya Patel',
        referralCount: 4,
        points: 22,
        badges: [],
      },
      {
        rank: 4,
        userId: 'wuser-4',
        name: 'Oliver Brown',
        referralCount: 3,
        points: 18,
        badges: [],
      },
      {
        rank: 5,
        userId: 'wuser-6',
        name: 'Isabella Garcia',
        referralCount: 2,
        points: 12,
        badges: [],
      },
    ],
  },
  {
    campaignId: 'campaign-1',
    period: 'monthly',
    entries: [
      {
        rank: 1,
        userId: 'wuser-1',
        name: 'Emma Watson',
        referralCount: 15,
        points: 78,
        badges: ['monthly_leader'],
      },
      {
        rank: 2,
        userId: 'wuser-2',
        name: 'James Chen',
        referralCount: 12,
        points: 65,
        badges: [],
      },
      {
        rank: 3,
        userId: 'wuser-15',
        name: 'David Kim',
        referralCount: 9,
        points: 50,
        badges: [],
      },
      {
        rank: 4,
        userId: 'wuser-10',
        name: 'Priya Patel',
        referralCount: 7,
        points: 40,
        badges: [],
      },
      {
        rank: 5,
        userId: 'wuser-4',
        name: 'Oliver Brown',
        referralCount: 6,
        points: 35,
        badges: [],
      },
    ],
  },
  {
    campaignId: 'campaign-2',
    period: 'all_time',
    entries: mockLeaderboardEntries.filter((e) => [
      'wuser-12',
      'wuser-11',
    ].includes(e.userId)),
  },
  {
    campaignId: 'campaign-4',
    period: 'all_time',
    entries: mockLeaderboardEntries.filter((e) => [
      'wuser-13',
      'wuser-14',
    ].includes(e.userId)),
  },
];

// Helper functions for leaderboards
export const getMockLeaderboard = (
  campaignId: string,
  period: Leaderboard['period'] = 'all_time'
): Leaderboard | undefined => {
  return mockLeaderboards.find(
    (lb) => lb.campaignId === campaignId && lb.period === period
  );
};

export const getMockLeaderboardEntry = (
  userId: string
): LeaderboardEntry | undefined => {
  return mockLeaderboardEntries.find((entry) => entry.userId === userId);
};

export const getMockTopReferrersLeaderboard = (
  limit: number = 10
): LeaderboardEntry[] => {
  return [...mockLeaderboardEntries]
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, limit);
};

// Mock referral stats by source
export const mockReferralsBySource = {
  link: mockReferrals.filter((r) => r.source === 'link'),
  email: mockReferrals.filter((r) => r.source === 'email'),
  twitter: mockReferrals.filter((r) => r.source === 'twitter'),
  facebook: mockReferrals.filter((r) => r.source === 'facebook'),
  linkedin: mockReferrals.filter((r) => r.source === 'linkedin'),
  whatsapp: mockReferrals.filter((r) => r.source === 'whatsapp'),
  instagram: mockReferrals.filter((r) => r.source === 'instagram'),
  other: mockReferrals.filter((r) => r.source === 'other'),
};

// Mock referral stats by status
export const mockReferralsByStatus = {
  clicked: mockReferrals.filter((r) => r.status === 'clicked'),
  signed_up: mockReferrals.filter((r) => r.status === 'signed_up'),
  verified: mockReferrals.filter((r) => r.status === 'verified'),
  converted: mockReferrals.filter((r) => r.status === 'converted'),
};
