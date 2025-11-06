/**
 * Mock data for team members
 */

import type { TeamMember } from '@/types/common.types';

/**
 * Mock team members
 */
export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    userId: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'owner',
    invitedAt: new Date('2024-01-15'),
    joinedAt: new Date('2024-01-15'),
    lastActiveAt: new Date('2025-11-06T10:30:00'),
  },
  {
    id: '2',
    userId: 'user-2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'admin',
    invitedAt: new Date('2024-02-10'),
    joinedAt: new Date('2024-02-11'),
    lastActiveAt: new Date('2025-11-05T15:20:00'),
  },
  {
    id: '3',
    userId: 'user-3',
    email: 'bob.johnson@example.com',
    name: 'Bob Johnson',
    role: 'editor',
    invitedAt: new Date('2024-03-05'),
    joinedAt: new Date('2024-03-06'),
    lastActiveAt: new Date('2025-11-04T09:15:00'),
  },
  {
    id: '4',
    userId: 'user-4',
    email: 'alice.williams@example.com',
    name: 'Alice Williams',
    role: 'viewer',
    invitedAt: new Date('2024-04-20'),
    joinedAt: new Date('2024-04-21'),
    lastActiveAt: new Date('2025-10-30T14:45:00'),
  },
  {
    id: '5',
    userId: 'user-5',
    email: 'charlie.brown@example.com',
    name: 'Charlie Brown',
    role: 'editor',
    invitedAt: new Date('2024-05-12'),
    joinedAt: new Date('2024-05-13'),
    lastActiveAt: new Date('2025-10-15T11:30:00'),
  },
];

/**
 * Mock pending invitations
 */
export const mockPendingInvitations: TeamMember[] = [
  {
    id: '6',
    userId: 'user-6',
    email: 'sarah.davis@example.com',
    name: 'Sarah Davis',
    role: 'editor',
    invitedAt: new Date('2025-11-01'),
    joinedAt: undefined,
    lastActiveAt: undefined,
  },
  {
    id: '7',
    userId: 'user-7',
    email: 'mike.wilson@example.com',
    name: 'Mike Wilson',
    role: 'viewer',
    invitedAt: new Date('2025-11-03'),
    joinedAt: undefined,
    lastActiveAt: undefined,
  },
];

/**
 * Mock team members by role
 */
export const mockTeamMembersByRole = {
  owner: mockTeamMembers.filter(m => m.role === 'owner'),
  admin: mockTeamMembers.filter(m => m.role === 'admin'),
  editor: mockTeamMembers.filter(m => m.role === 'editor'),
  viewer: mockTeamMembers.filter(m => m.role === 'viewer'),
};

/**
 * All team members including pending
 */
export const mockAllTeamMembers = [
  ...mockTeamMembers,
  ...mockPendingInvitations,
];
