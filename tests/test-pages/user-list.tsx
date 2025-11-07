import React from 'react';
import { createRoot } from 'react-dom/client';
import { UserList } from '@/features/users/components/UserList/component';
import type { WaitlistUser } from '@/types/common.types';
import '@/design-tokens/global.scss';

const mockUsers: WaitlistUser[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    status: 'verified',
    position: 1,
    referralCount: 5,
    source: 'twitter',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    status: 'pending',
    position: 2,
    referralCount: 0,
    source: 'direct',
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    status: 'active',
    position: 3,
    referralCount: 3,
    source: 'facebook',
    createdAt: new Date('2024-01-15'),
  },
];

function TestApp() {
  const [exportedIds, setExportedIds] = React.useState<string[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<WaitlistUser | null>(null);

  return (
    <div style={{ padding: '40px' }}>
      <h1>User List Tests</h1>

      <UserList
        campaignId="test-campaign"
        users={mockUsers}
        loading={false}
        showFilters={true}
        onUserClick={(user) => setSelectedUser(user)}
        onExport={async (userIds) => {
          setExportedIds(userIds);
        }}
        data-testid="user-list"
      />

      {exportedIds.length > 0 && (
        <div data-testid="export-result">
          Exported {exportedIds.length} user{exportedIds.length !== 1 ? 's' : ''}
        </div>
      )}

      {selectedUser && (
        <div data-testid="selected-user">
          Selected: {selectedUser.email}
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}
