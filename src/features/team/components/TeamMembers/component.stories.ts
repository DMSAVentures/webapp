/**
 * TeamMembers Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TeamMembers } from './component';

const meta = {
  title: 'Features/Team/TeamMembers',
  component: TeamMembers,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onInvite: {
      description: 'Callback when invite button is clicked',
      action: 'invited',
    },
  },
} satisfies Meta<typeof TeamMembers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default team members view
 * Note: This will fetch data using the useGetTeamMembers hook
 */
export const Default: Story = {
  args: {
    onInvite: () => console.log('Invite clicked'),
  },
};

/**
 * Interactive demo
 * Note: Component includes all interactive features:
 * - Invite team members
 * - Change member roles
 * - Remove members
 * - View pending invitations
 */
export const Interactive: Story = {
  args: {
    onInvite: () => console.log('Invite clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'This component displays team members with full management capabilities. Click "Invite Member" to add new members, use the role dropdown to change permissions, and click the delete icon to remove members.',
      },
    },
  },
};
