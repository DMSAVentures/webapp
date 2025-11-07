import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReferralLink } from '@/features/referrals/components/ReferralLink/component';
import '@/design-tokens/global.scss';

function TestApp() {
  const [copyCount, setCopyCount] = React.useState(0);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Referral Link Tests</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Referral Link Component</h2>
        <ReferralLink
          referralCode="TEST123"
          baseUrl="https://example.com"
          onCopy={() => setCopyCount(prev => prev + 1)}
          data-testid="referral-link"
        />
        {copyCount > 0 && (
          <div data-testid="copy-count">
            Copied {copyCount} time{copyCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}
