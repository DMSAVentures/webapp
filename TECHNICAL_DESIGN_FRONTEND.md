# Technical Design Document - Frontend Architecture
## Viral Waitlist & Referral Marketing Platform

**Version:** 1.0
**Last Updated:** November 5, 2025
**Target Implementation:** Phase 1-3 (Months 1-9)
**Stack:** Vite + React 19 + TypeScript + SCSS Modules + TanStack Router

---

## Table of Contents

1. Architecture Overview
2. Application Structure
3. State Management Architecture
4. Component Architecture
5. Routing & Navigation
6. API Integration Layer
7. Real-Time Features
8. Form Management System
9. Analytics & Visualization
10. Security Implementation
11. Performance Strategy
12. Testing Strategy
13. Development Phases

---

## 1. Architecture Overview

### Core Principles

**Architectural Style:** Feature-Based Modular Architecture
- Features organized by domain (campaigns, users, analytics, rewards, etc.)
- Shared design system components remain in `proto-design-system/`
- Cross-cutting concerns in dedicated directories (hooks, contexts, utils)

**State Management Philosophy:**
- Server state via React Query (TanStack Query) - NOT Redux
- Local UI state via React hooks (useState, useReducer)
- Global app state via React Context (minimal usage)
- Real-time state via WebSocket + React Query integration
- Form state via controlled components + validation library

**Data Flow Pattern:**
- Unidirectional data flow (React standard)
- API → React Query Cache → Components
- WebSocket → Event Handlers → React Query Cache Invalidation → Components
- Forms → Validation → API → Success/Error States

### Technology Decisions

**Core Stack:**
- **React 19.0.0** - Latest features (use transitions, concurrent rendering)
- **TypeScript Strict Mode** - Full type safety
- **TanStack Router** - File-based routing with type safety
- **TanStack Query (React Query)** - Server state management
- **SCSS Modules + BEM** - Styling (existing pattern)
- **Vite 6.3.0** - Build tool with fast HMR

**New Dependencies Required:**
```json
{
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-query-devtools": "^5.0.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
  "recharts": "^2.10.0",
  "date-fns": "^3.0.0",
  "react-hot-toast": "^2.4.0",
  "zustand": "^4.5.0",
  "immer": "^10.0.0",
  "socket.io-client": "^4.6.0",
  "qrcode.react": "^3.1.0",
  "copy-to-clipboard": "^3.3.0",
  "react-confetti": "^6.1.0",
  "framer-motion": "^11.0.0"
}
```

---

## 2. Application Structure

### Directory Organization

```
src/
├── features/                      # Feature-based modules
│   ├── campaigns/                 # Campaign management
│   │   ├── components/            # Feature-specific components
│   │   │   ├── CampaignCard/
│   │   │   ├── CampaignForm/
│   │   │   ├── CampaignList/
│   │   │   └── CampaignStats/
│   │   ├── hooks/                 # Feature-specific hooks
│   │   │   ├── useCampaigns.ts
│   │   │   ├── useCreateCampaign.ts
│   │   │   ├── useUpdateCampaign.ts
│   │   │   └── useCampaignAnalytics.ts
│   │   ├── types/                 # Feature-specific types
│   │   │   └── campaign.types.ts
│   │   └── utils/                 # Feature-specific utilities
│   │       └── campaign.utils.ts
│   │
│   ├── form-builder/              # Visual form builder
│   │   ├── components/
│   │   │   ├── FormCanvas/
│   │   │   ├── FormFieldPalette/
│   │   │   ├── FormPreview/
│   │   │   ├── FormStyleEditor/
│   │   │   └── FieldConfigPanel/
│   │   ├── hooks/
│   │   │   ├── useFormBuilder.ts
│   │   │   └── useFormPreview.ts
│   │   └── types/
│   │       └── form-builder.types.ts
│   │
│   ├── users/                     # User/waitlist management
│   │   ├── components/
│   │   │   ├── UserList/
│   │   │   ├── UserProfile/
│   │   │   ├── UserFilters/
│   │   │   ├── UserSegments/
│   │   │   └── BulkActions/
│   │   ├── hooks/
│   │   │   ├── useUsers.ts
│   │   │   ├── useUserSearch.ts
│   │   │   ├── useUserSegments.ts
│   │   │   └── useBulkOperations.ts
│   │   └── types/
│   │       └── user.types.ts
│   │
│   ├── referrals/                 # Viral referral system
│   │   ├── components/
│   │   │   ├── ReferralDashboard/
│   │   │   ├── ReferralLink/
│   │   │   ├── ShareButtons/
│   │   │   ├── LeaderboardWidget/
│   │   │   ├── ReferralTree/
│   │   │   └── PositionTracker/
│   │   ├── hooks/
│   │   │   ├── useReferrals.ts
│   │   │   ├── useLeaderboard.ts
│   │   │   └── useReferralTracking.ts
│   │   └── types/
│   │       └── referral.types.ts
│   │
│   ├── analytics/                 # Analytics & reporting
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard/
│   │   │   ├── ConversionFunnel/
│   │   │   ├── TrafficSources/
│   │   │   ├── ViralMetrics/
│   │   │   ├── ChartWidgets/
│   │   │   └── ReportBuilder/
│   │   ├── hooks/
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useFunnelData.ts
│   │   │   └── useRealtimeData.ts
│   │   └── types/
│   │       └── analytics.types.ts
│   │
│   ├── emails/                    # Email automation
│   │   ├── components/
│   │   │   ├── EmailEditor/
│   │   │   ├── EmailTemplates/
│   │   │   ├── EmailCampaigns/
│   │   │   ├── EmailAnalytics/
│   │   │   └── AutomationBuilder/
│   │   ├── hooks/
│   │   │   ├── useEmailTemplates.ts
│   │   │   ├── useEmailCampaigns.ts
│   │   │   └── useEmailAutomation.ts
│   │   └── types/
│   │       └── email.types.ts
│   │
│   ├── rewards/                   # Reward system
│   │   ├── components/
│   │   │   ├── RewardBuilder/
│   │   │   ├── RewardTiers/
│   │   │   ├── RewardProgress/
│   │   │   └── RewardDelivery/
│   │   ├── hooks/
│   │   │   ├── useRewards.ts
│   │   │   └── useRewardTriggers.ts
│   │   └── types/
│   │       └── reward.types.ts
│   │
│   ├── team/                      # Team collaboration
│   │   ├── components/
│   │   │   ├── TeamMembers/
│   │   │   ├── RoleManagement/
│   │   │   ├── ActivityFeed/
│   │   │   └── TeamInvite/
│   │   ├── hooks/
│   │   │   ├── useTeam.ts
│   │   │   └── usePermissions.ts
│   │   └── types/
│   │       └── team.types.ts
│   │
│   ├── integrations/              # Third-party integrations
│   │   ├── components/
│   │   │   ├── IntegrationList/
│   │   │   ├── IntegrationSetup/
│   │   │   └── WebhookManager/
│   │   ├── hooks/
│   │   │   ├── useIntegrations.ts
│   │   │   └── useWebhooks.ts
│   │   └── types/
│   │       └── integration.types.ts
│   │
│   └── auth/                      # Authentication
│       ├── components/
│       │   ├── LoginForm/
│       │   ├── SignupForm/
│       │   ├── TwoFactorSetup/
│       │   └── PasswordReset/
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── use2FA.ts
│       └── types/
│           └── auth.types.ts
│
├── proto-design-system/           # Existing design system (keep as is)
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   └── ... (28+ components)
│
├── contexts/                      # Global React contexts
│   ├── AuthContext.tsx           # User authentication state
│   ├── WorkspaceContext.tsx      # Current workspace/campaign
│   ├── ThemeContext.tsx          # Theme switching
│   └── WebSocketContext.tsx      # WebSocket connection
│
├── hooks/                         # Shared custom hooks
│   ├── fetcher.ts                # Existing HTTP client (keep)
│   ├── useLocalStorage.ts        # Existing (keep)
│   ├── useQueryParams.ts         # NEW - URL param management
│   ├── useDebounce.ts            # NEW - Debouncing
│   ├── useInfiniteScroll.ts      # NEW - Pagination
│   ├── useClipboard.ts           # NEW - Copy to clipboard
│   ├── useWebSocket.ts           # NEW - WebSocket hook
│   └── usePermissions.ts         # NEW - Permission checks
│
├── lib/                           # Third-party library configs
│   ├── react-query.ts            # React Query setup
│   ├── websocket.ts              # Socket.io client setup
│   └── analytics.ts              # Analytics tracking
│
├── services/                      # API service layer
│   ├── api.ts                    # Base API client (uses fetcher)
│   ├── campaigns.service.ts      # Campaign API calls
│   ├── users.service.ts          # User API calls
│   ├── referrals.service.ts      # Referral API calls
│   ├── analytics.service.ts      # Analytics API calls
│   ├── emails.service.ts         # Email API calls
│   └── webhooks.service.ts       # Webhook API calls
│
├── types/                         # Shared TypeScript types
│   ├── api.types.ts              # API response/request types
│   ├── common.types.ts           # Common types
│   ├── enums.ts                  # Shared enums
│   └── index.ts                  # Type exports
│
├── utils/                         # Shared utilities
│   ├── date.utils.ts             # Date formatting/parsing
│   ├── number.utils.ts           # Number formatting
│   ├── validation.utils.ts       # Form validation helpers
│   ├── url.utils.ts              # URL manipulation
│   ├── export.utils.ts           # CSV/JSON export
│   └── analytics.utils.ts        # Analytics helpers
│
├── constants/                     # Application constants
│   ├── routes.ts                 # Route paths
│   ├── api-endpoints.ts          # API endpoints
│   ├── permissions.ts            # Permission constants
│   └── defaults.ts               # Default values
│
├── design-tokens/                 # Existing (keep as is)
│   ├── variables.scss
│   └── theme.scss
│
└── routes/                        # TanStack Router routes
    ├── __root.tsx                # Root layout
    ├── index.tsx                 # Dashboard home
    ├── campaigns/
    │   ├── index.tsx             # Campaign list
    │   ├── $campaignId/
    │   │   ├── index.tsx         # Campaign overview
    │   │   ├── form-builder.tsx  # Form builder
    │   │   ├── users.tsx         # User list
    │   │   ├── analytics.tsx     # Analytics
    │   │   ├── emails.tsx        # Email campaigns
    │   │   └── settings.tsx      # Settings
    │   └── new.tsx               # Create campaign
    ├── analytics/
    │   └── index.tsx             # Global analytics
    ├── team/
    │   └── index.tsx             # Team management
    ├── integrations/
    │   └── index.tsx             # Integrations
    ├── settings/
    │   ├── index.tsx             # General settings
    │   ├── billing.tsx           # Billing
    │   └── security.tsx          # Security settings
    └── auth/
        ├── login.tsx             # Login
        ├── signup.tsx            # Signup
        └── verify.tsx            # Email verification
```

---

## 3. State Management Architecture

### React Query Configuration

**Setup (lib/react-query.ts):**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,          // 5 minutes
      cacheTime: 10 * 60 * 1000,         // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys factory for consistency
export const queryKeys = {
  campaigns: {
    all: ['campaigns'] as const,
    lists: () => [...queryKeys.campaigns.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.campaigns.lists(), { filters }] as const,
    details: () => [...queryKeys.campaigns.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
    analytics: (id: string) => [...queryKeys.campaigns.detail(id), 'analytics'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (campaignId: string, filters?: string) =>
      [...queryKeys.users.lists(), campaignId, { filters }] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  referrals: {
    all: ['referrals'] as const,
    leaderboard: (campaignId: string) =>
      [...queryKeys.referrals.all, 'leaderboard', campaignId] as const,
    userReferrals: (userId: string) =>
      [...queryKeys.referrals.all, 'user', userId] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    campaign: (campaignId: string, dateRange: string) =>
      [...queryKeys.analytics.all, campaignId, dateRange] as const,
    funnel: (campaignId: string) =>
      [...queryKeys.analytics.all, 'funnel', campaignId] as const,
  },
  emails: {
    all: ['emails'] as const,
    templates: () => [...queryKeys.emails.all, 'templates'] as const,
    campaigns: (campaignId: string) =>
      [...queryKeys.emails.all, 'campaigns', campaignId] as const,
  },
  rewards: {
    all: ['rewards'] as const,
    list: (campaignId: string) => [...queryKeys.rewards.all, campaignId] as const,
  },
  team: {
    all: ['team'] as const,
    members: () => [...queryKeys.team.all, 'members'] as const,
    activity: () => [...queryKeys.team.all, 'activity'] as const,
  },
};
```

### State Management Patterns

**Pattern 1: Server State (React Query)**
Use for ALL API data:
- Campaign data, user lists, analytics, email templates, team members
- Auto-caching, background refetching, optimistic updates
- Error handling and retry logic built-in

**Pattern 2: Local UI State (useState/useReducer)**
Use for component-specific state:
- Form inputs, modal open/close, accordion expanded/collapsed
- Selected items, filter states (before applying)
- Loading states for UI interactions

**Pattern 3: Global App State (Zustand)**
Use sparingly for cross-cutting concerns:
- Current workspace/campaign selection
- Toast notifications
- Real-time connection status
- User preferences (theme, language)

**Zustand Store Example (lib/store.ts):**
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // Current workspace
  currentCampaignId: string | null;
  setCurrentCampaign: (id: string | null) => void;

  // Real-time connection
  isWebSocketConnected: boolean;
  setWebSocketConnected: (connected: boolean) => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    currentCampaignId: null,
    setCurrentCampaign: (id) => set({ currentCampaignId: id }),

    isWebSocketConnected: false,
    setWebSocketConnected: (connected) => set({ isWebSocketConnected: connected }),

    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    }),

    toasts: [],
    addToast: (toast) => set((state) => {
      state.toasts.push({ ...toast, id: crypto.randomUUID() });
    }),
    removeToast: (id) => set((state) => {
      state.toasts = state.toasts.filter(t => t.id !== id);
    }),
  }))
);
```

**Pattern 4: Form State (React Hook Form + Zod)**
Use for ALL forms:
- Type-safe validation
- Performance (minimal re-renders)
- Built-in error handling

---

## 4. Component Architecture

### Component Hierarchy Patterns

**Level 1: Route Components** (in `routes/`)
- Data fetching with React Query
- Layout composition
- Route-level error boundaries
- No business logic (delegate to hooks)

**Level 2: Feature Components** (in `features/[feature]/components/`)
- Feature-specific business logic
- Use feature hooks for data/operations
- Compose design system components
- Handle feature-specific errors

**Level 3: Design System Components** (in `proto-design-system/`)
- Pure presentational (existing pattern)
- No business logic or API calls
- Highly reusable

### Component Communication Patterns

**Parent → Child:** Props (existing pattern)
**Child → Parent:** Callbacks via props
**Sibling → Sibling:** Lift state up or React Query cache
**Cross-feature:** React Query cache or Zustand store

### New Component Categories

**Category 1: Data Display Components**
Purpose: Display fetched data with loading/error states

Example Pattern:
```typescript
// features/campaigns/components/CampaignCard/component.tsx
export interface CampaignCardProps {
  campaignId: string;
  onClick?: () => void;
  showAnalytics?: boolean;
}

export const CampaignCard = memo<CampaignCardProps>(({
  campaignId,
  onClick,
  showAnalytics = false
}) => {
  // Use React Query for data
  const { data: campaign, isLoading, error } = useCampaign(campaignId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error.message} />;
  if (!campaign) return null;

  return (
    <Card onClick={onClick}>
      {/* Use design system components */}
      <div className={styles.header}>
        <Heading level={3}>{campaign.name}</Heading>
        <Badge variant={campaign.status}>{campaign.status}</Badge>
      </div>
      {showAnalytics && (
        <CampaignStats campaignId={campaignId} />
      )}
    </Card>
  );
});
```

**Category 2: Form Components**
Purpose: User input with validation

Example Pattern:
```typescript
// features/campaigns/components/CampaignForm/component.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  redirectUrl: z.string().url().optional(),
  emailVerificationRequired: z.boolean(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  onCancel?: () => void;
}

export const CampaignForm = memo<CampaignFormProps>(({
  initialData,
  onSubmit,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TextInput
        label="Campaign Name"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register('description')}
      />

      <TextInput
        label="Redirect URL"
        type="url"
        error={errors.redirectUrl?.message}
        {...register('redirectUrl')}
      />

      <Checkbox
        label="Require email verification"
        {...register('emailVerificationRequired')}
      />

      <div className={styles.actions}>
        <Button type="submit" loading={isSubmitting}>
          Save Campaign
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
});
```

**Category 3: Interactive Widgets**
Purpose: Real-time interaction and updates

Examples:
- `ShareButtons` - Social sharing with tracking
- `PositionTracker` - Live position updates via WebSocket
- `ReferralLink` - Copy link with confetti animation
- `LeaderboardWidget` - Real-time leaderboard updates

**Category 4: Analytics Components**
Purpose: Data visualization

Examples:
- `ConversionFunnel` - Multi-step funnel chart
- `TrafficSources` - Pie/bar charts for sources
- `GrowthChart` - Time-series line chart
- `ViralMetrics` - K-factor, cycle time display

**Category 5: Builder/Editor Components**
Purpose: Complex visual editing

Examples:
- `FormBuilder` - Drag-and-drop form editor
- `EmailEditor` - WYSIWYG email template editor
- `RewardBuilder` - Tiered reward configuration
- `AutomationBuilder` - Visual workflow editor

---

## 5. Routing & Navigation

### Route Structure

**Public Routes (No Auth):**
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/auth/verify/:token` - Email verification
- `/auth/reset-password` - Password reset
- `/w/:referralCode` - Public waitlist signup (embedded/hosted)

**Protected Routes (Auth Required):**
- `/` - Dashboard overview
- `/campaigns` - Campaign list
- `/campaigns/new` - Create campaign wizard
- `/campaigns/:id` - Campaign overview
- `/campaigns/:id/form-builder` - Form builder
- `/campaigns/:id/users` - User/waitlist management
- `/campaigns/:id/analytics` - Campaign analytics
- `/campaigns/:id/emails` - Email campaigns
- `/campaigns/:id/referrals` - Referral management
- `/campaigns/:id/rewards` - Reward configuration
- `/campaigns/:id/integrations` - Campaign integrations
- `/campaigns/:id/settings` - Campaign settings
- `/analytics` - Global analytics dashboard
- `/team` - Team management
- `/integrations` - Integration marketplace
- `/settings` - Account settings
- `/settings/billing` - Billing management
- `/settings/security` - Security settings (2FA, SSO)

### Navigation Patterns

**Primary Navigation (Sidebar):**
- Dashboard
- Campaigns (with campaign switcher dropdown)
- Analytics
- Team
- Integrations
- Settings

**Secondary Navigation (Campaign Context):**
When a campaign is selected, show sub-navigation:
- Overview
- Form Builder
- Users
- Analytics
- Emails
- Referrals
- Rewards
- Integrations
- Settings

**Breadcrumb Navigation:**
Show hierarchy: Dashboard > Campaigns > "Product Launch" > Users

### Route Protection Pattern

```typescript
// routes/__root.tsx
import { Outlet, Navigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const Route = () => {
  const { user, isLoading } = useAuth();
  const isPublicRoute = ['/auth/login', '/auth/signup', '/w/'].some(path =>
    location.pathname.startsWith(path)
  );

  if (isLoading) return <LoadingScreen />;
  if (!user && !isPublicRoute) return <Navigate to="/auth/login" />;
  if (user && isPublicRoute) return <Navigate to="/" />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};
```

---

## 6. API Integration Layer

### Service Layer Architecture

**Base API Client (services/api.ts):**
```typescript
import { fetcher } from '@/hooks/fetcher';

const API_BASE = import.meta.env.VITE_API_URL;

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return fetcher<T>(url.toString());
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return fetcher<T>(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return fetcher<T>(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return fetcher<T>(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return fetcher<T>(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
```

### Feature Service Pattern

**Example: Campaign Service (services/campaigns.service.ts):**
```typescript
import { apiClient } from './api';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignAnalytics,
  CampaignStats,
} from '@/types';

export const campaignsService = {
  // List campaigns
  list: (params?: { status?: string; search?: string }) =>
    apiClient.get<Campaign[]>('/api/campaigns', params),

  // Get single campaign
  get: (id: string) =>
    apiClient.get<Campaign>(`/api/campaigns/${id}`),

  // Create campaign
  create: (data: CreateCampaignRequest) =>
    apiClient.post<Campaign>('/api/campaigns', data),

  // Update campaign
  update: (id: string, data: UpdateCampaignRequest) =>
    apiClient.patch<Campaign>(`/api/campaigns/${id}`, data),

  // Delete campaign
  delete: (id: string) =>
    apiClient.delete<void>(`/api/campaigns/${id}`),

  // Get analytics
  getAnalytics: (id: string, dateRange?: string) =>
    apiClient.get<CampaignAnalytics>(`/api/campaigns/${id}/analytics`, { dateRange }),

  // Get real-time stats
  getStats: (id: string) =>
    apiClient.get<CampaignStats>(`/api/campaigns/${id}/stats`),

  // Export users
  exportUsers: (id: string, format: 'csv' | 'xlsx') =>
    apiClient.get<Blob>(`/api/campaigns/${id}/export`, { format }),
};
```

### React Query Hook Pattern

**Example: Campaign Hooks (features/campaigns/hooks/useCampaigns.ts):**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { queryKeys } from '@/lib/react-query';
import { useToast } from '@/hooks/useToast';

// GET - List campaigns
export const useCampaigns = (filters?: { status?: string; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.campaigns.list(JSON.stringify(filters)),
    queryFn: () => campaignsService.list(filters),
  });
};

// GET - Single campaign
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => campaignsService.get(id),
    enabled: !!id,
  });
};

// POST - Create campaign
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: campaignsService.create,
    onSuccess: (newCampaign) => {
      // Invalidate campaign list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });

      // Optimistically add to cache
      queryClient.setQueryData(
        queryKeys.campaigns.detail(newCampaign.id),
        newCampaign
      );

      showToast({
        type: 'success',
        message: 'Campaign created successfully!',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to create campaign',
      });
    },
  });
};

// PATCH - Update campaign
export const useUpdateCampaign = (id: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateCampaignRequest) =>
      campaignsService.update(id, data),
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.campaigns.detail(id)
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData(
        queryKeys.campaigns.detail(id)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.campaigns.detail(id),
        (old: Campaign) => ({ ...old, ...updates })
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.campaigns.detail(id),
          context.previous
        );
      }
      showToast({
        type: 'error',
        message: error.message || 'Failed to update campaign',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(id)
      });
      showToast({
        type: 'success',
        message: 'Campaign updated successfully!',
      });
    },
  });
};

// DELETE - Delete campaign
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: campaignsService.delete,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.campaigns.detail(deletedId) });

      showToast({
        type: 'success',
        message: 'Campaign deleted successfully',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error.message || 'Failed to delete campaign',
      });
    },
  });
};

// GET - Campaign analytics
export const useCampaignAnalytics = (
  id: string,
  dateRange?: string
) => {
  return useQuery({
    queryKey: queryKeys.campaigns.analytics(id),
    queryFn: () => campaignsService.getAnalytics(id, dateRange),
    enabled: !!id,
    refetchInterval: 60000, // Refetch every minute
  });
};
```

### Pagination Pattern

**Infinite Scroll (for user lists):**
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteUsers = (campaignId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.users.list(campaignId),
    queryFn: ({ pageParam = 0 }) =>
      usersService.list(campaignId, { offset: pageParam, limit: 50 }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 50) return undefined;
      return allPages.length * 50;
    },
  });
};
```

### File Upload Pattern

**Example: CSV Import (features/users/hooks/useImportUsers.ts):**
```typescript
export const useImportUsers = (campaignId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return fetcher<{ imported: number; failed: number }>(
        `${import.meta.env.VITE_API_URL}/api/campaigns/${campaignId}/import`,
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type - browser will set with boundary
          headers: {},
        }
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(campaignId)
      });
      showToast({
        type: 'success',
        message: `Imported ${result.imported} users. ${result.failed} failed.`,
      });
    },
  });
};
```

---

## 7. Real-Time Features

### WebSocket Architecture

**Connection Management (lib/websocket.ts):**
```typescript
import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) throw new Error('Socket not connected');
    this.socket.on(event, callback);
  }

  unsubscribe(event: string, callback?: (data: any) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  emit(event: string, data?: any) {
    if (!this.socket) throw new Error('Socket not connected');
    this.socket.emit(event, data);
  }
}

export const wsManager = new WebSocketManager();
```

### React Hook for WebSocket

**Custom Hook (hooks/useWebSocket.ts):**
```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsManager } from '@/lib/websocket';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppStore } from '@/lib/store';
import { queryKeys } from '@/lib/react-query';

export const useWebSocket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { setWebSocketConnected } = useAppStore();

  useEffect(() => {
    if (!user) return;

    const socket = wsManager.connect(user.id);

    socket.on('connect', () => {
      setWebSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setWebSocketConnected(false);
    });

    // Real-time event handlers
    socket.on('user:created', (data: { campaignId: string; user: User }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(data.campaignId)
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(data.campaignId)
      });
    });

    socket.on('referral:created', (data: { userId: string; referral: Referral }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.userReferrals(data.userId)
      });
    });

    socket.on('position:updated', (data: { userId: string; newPosition: number }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(data.userId)
      });
    });

    socket.on('leaderboard:updated', (data: { campaignId: string }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.referrals.leaderboard(data.campaignId)
      });
    });

    socket.on('campaign:milestone', (data: { campaignId: string; milestone: string }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(data.campaignId)
      });
      // Show celebration animation
    });

    return () => {
      wsManager.disconnect();
      setWebSocketConnected(false);
    };
  }, [user?.id]);
};
```

### Real-Time Component Pattern

**Example: Live Position Tracker (features/referrals/components/PositionTracker):**
```typescript
export const PositionTracker = memo<{ userId: string }>(({ userId }) => {
  const [position, setPosition] = useState<number | null>(null);
  const [previousPosition, setPreviousPosition] = useState<number | null>(null);
  const { data: user } = useUser(userId);

  useEffect(() => {
    if (user?.position) {
      setPreviousPosition(position);
      setPosition(user.position);
    }
  }, [user?.position]);

  useEffect(() => {
    const handlePositionUpdate = (data: { userId: string; newPosition: number }) => {
      if (data.userId === userId) {
        setPreviousPosition(position);
        setPosition(data.newPosition);
      }
    };

    wsManager.subscribe('position:updated', handlePositionUpdate);

    return () => {
      wsManager.unsubscribe('position:updated', handlePositionUpdate);
    };
  }, [userId, position]);

  const improved = previousPosition && position && position < previousPosition;

  return (
    <div className={styles.tracker}>
      <div className={styles.position}>
        <span className={styles.label}>Your Position</span>
        <motion.span
          className={styles.value}
          animate={improved ? { scale: [1, 1.2, 1] } : {}}
        >
          #{position || '...'}
        </motion.span>
      </div>

      {improved && (
        <motion.div
          className={styles.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ↑ Moved up {previousPosition - position} spots!
        </motion.div>
      )}

      {improved && <Confetti recycle={false} numberOfPieces={50} />}
    </div>
  );
});
```

---

## 8. Form Management System

### Form Builder Architecture

**Form Configuration Type (types/form-builder.types.ts):**
```typescript
export interface FormField {
  id: string;
  type: 'email' | 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'phone' | 'url' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[]; // For select/radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customError?: string;
  };
  conditionalLogic?: {
    showIf: {
      fieldId: string;
      operator: 'equals' | 'contains' | 'not_equals';
      value: any;
    };
  };
}

export interface FormConfig {
  id: string;
  campaignId: string;
  fields: FormField[];
  design: {
    layout: 'single-column' | 'two-column' | 'multi-step';
    colors: {
      primary: string;
      background: string;
      text: string;
      border: string;
      error: string;
    };
    typography: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
    };
    spacing: {
      padding: number;
      gap: number;
    };
    customCss?: string;
  };
  behavior: {
    submitAction: 'inline-message' | 'redirect' | 'referral-page';
    redirectUrl?: string;
    successMessage?: string;
    doubleOptIn: boolean;
    duplicateHandling: 'block' | 'update' | 'allow';
  };
  integrations: {
    googleAnalytics?: string;
    facebookPixel?: string;
    customScripts?: string[];
  };
}
```

### Form Builder Component

**Visual Editor (features/form-builder/components/FormCanvas):**
- Drag-and-drop field reordering
- Live preview (mobile/tablet/desktop)
- Field configuration panel
- Style editor panel
- Behavior settings
- Integration setup

**Implementation Notes:**
- Use `@dnd-kit/core` for drag-and-drop
- Use `zustand` for builder state (undo/redo)
- Auto-save every 10 seconds
- Version history (last 10 versions)

### Form Rendering (Public Widget)

**Embeddable Form Widget:**
```typescript
// This is a separate build target: vite.config.widget.ts
// Produces: /dist/widget.js (< 50KB gzipped)

import { createRoot } from 'react-dom/client';
import { PublicWaitlistForm } from './PublicWaitlistForm';

class WaitlistWidget {
  private config: { campaignId: string; containerId?: string };

  constructor(config: { campaignId: string; containerId?: string }) {
    this.config = config;
  }

  mount() {
    const container = this.config.containerId
      ? document.getElementById(this.config.containerId)
      : this.createContainer();

    if (!container) {
      console.error('Container not found');
      return;
    }

    // Fetch form config
    fetch(`${API_URL}/api/public/forms/${this.config.campaignId}`)
      .then(res => res.json())
      .then(formConfig => {
        const root = createRoot(container);
        root.render(<PublicWaitlistForm config={formConfig} />);
      });
  }

  private createContainer() {
    const container = document.createElement('div');
    container.id = 'waitlist-widget';
    document.currentScript?.parentNode?.insertBefore(
      container,
      document.currentScript
    );
    return container;
  }
}

// Global API
(window as any).WaitlistWidget = WaitlistWidget;

// Auto-init if data-campaign-id present
const script = document.currentScript as HTMLScriptElement;
const campaignId = script?.dataset.campaignId;
if (campaignId) {
  new WaitlistWidget({ campaignId }).mount();
}
```

**Usage:**
```html
<!-- Option 1: Auto-init -->
<script src="https://cdn.yourapp.com/widget.js" data-campaign-id="abc123"></script>

<!-- Option 2: Manual init -->
<div id="my-form"></div>
<script src="https://cdn.yourapp.com/widget.js"></script>
<script>
  new WaitlistWidget({
    campaignId: 'abc123',
    containerId: 'my-form'
  }).mount();
</script>
```

---

## 9. Analytics & Visualization

### Chart Component Architecture

**Chart Library:** Use Recharts (already lightweight, React-friendly)

**Base Chart Component Pattern:**
```typescript
// features/analytics/components/ChartWidgets/BaseChart/component.tsx
export interface BaseChartProps {
  data: any[];
  loading?: boolean;
  error?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export const BaseChart = memo<BaseChartProps>(({
  data,
  loading,
  error,
  height = 300,
  children,
  showLegend = true,
  showGrid = true,
}) => {
  if (loading) return <ChartSkeleton height={height} />;
  if (error) return <ErrorMessage error={error} />;
  if (!data.length) return <EmptyState message="No data available" />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  );
});
```

**Specific Chart Components:**

**1. Line Chart (Growth Over Time):**
```typescript
export const GrowthChart = memo<{ campaignId: string; dateRange: string }>(
  ({ campaignId, dateRange }) => {
    const { data, isLoading, error } = useAnalytics(campaignId, dateRange);

    return (
      <BaseChart data={data?.daily || []} loading={isLoading} error={error?.message}>
        <LineChart data={data?.daily}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="signups"
            stroke="var(--color-primary)"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="referrals"
            stroke="var(--color-success)"
            strokeWidth={2}
          />
        </LineChart>
      </BaseChart>
    );
  }
);
```

**2. Funnel Chart (Conversion Funnel):**
```typescript
export const ConversionFunnel = memo<{ campaignId: string }>(
  ({ campaignId }) => {
    const { data, isLoading } = useFunnelData(campaignId);

    const funnelData = [
      { name: 'Impressions', value: data?.impressions || 0 },
      { name: 'Form Started', value: data?.started || 0 },
      { name: 'Submitted', value: data?.submitted || 0 },
      { name: 'Verified', value: data?.verified || 0 },
      { name: 'Referred', value: data?.referred || 0 },
    ];

    return (
      <BaseChart data={funnelData} loading={isLoading}>
        <BarChart data={funnelData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill="var(--color-primary)">
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </BaseChart>
    );
  }
);
```

**3. Pie Chart (Traffic Sources):**
```typescript
export const TrafficSources = memo<{ campaignId: string }>(
  ({ campaignId }) => {
    const { data, isLoading } = useTrafficSources(campaignId);

    const COLORS = [
      'var(--color-blue-500)',
      'var(--color-green-500)',
      'var(--color-purple-500)',
      'var(--color-orange-500)',
      'var(--color-pink-500)',
    ];

    return (
      <BaseChart data={data || []} loading={isLoading}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data?.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </BaseChart>
    );
  }
);
```

### Real-Time Dashboard Widgets

**Live Activity Feed:**
```typescript
export const LiveActivityFeed = memo<{ campaignId: string }>(
  ({ campaignId }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const MAX_ACTIVITIES = 20;

    useEffect(() => {
      const handleActivity = (activity: Activity) => {
        setActivities(prev => [activity, ...prev].slice(0, MAX_ACTIVITIES));
      };

      wsManager.subscribe(`campaign:${campaignId}:activity`, handleActivity);

      return () => {
        wsManager.unsubscribe(`campaign:${campaignId}:activity`, handleActivity);
      };
    }, [campaignId]);

    return (
      <Card className={styles.feed}>
        <Heading level={3}>Live Activity</Heading>
        <AnimatePresence>
          {activities.map(activity => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.activity}
            >
              <ActivityIcon type={activity.type} />
              <span>{activity.message}</span>
              <span className={styles.time}>
                {formatDistanceToNow(activity.timestamp)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </Card>
    );
  }
);
```

---

## 10. Security Implementation

### Authentication Flow

**Auth Context (contexts/AuthContext.tsx):**
```typescript
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await fetcher<User>('/api/auth/me');
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetcher<{ user: User; requires2FA?: boolean }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.requires2FA) {
      // Redirect to 2FA page
      throw new Error('2FA_REQUIRED');
    }

    setUser(response.user);
  };

  const logout = async () => {
    await fetcher('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  // ... other methods

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      // ...
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Permission Checking

**Permission Hook (hooks/usePermissions.ts):**
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

export const PERMISSIONS = {
  CAMPAIGNS_VIEW: 'campaigns:view',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_EDIT: 'campaigns:edit',
  CAMPAIGNS_DELETE: 'campaigns:delete',
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_EXPORT: 'users:export',
  EMAILS_SEND: 'emails:send',
  TEAM_MANAGE: 'team:manage',
  BILLING_MANAGE: 'billing:manage',
  SETTINGS_EDIT: 'settings:edit',
} as const;

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'owner') return true; // Owner has all permissions
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(hasPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can: hasPermission, // Alias
  };
};
```

**Permission Guard Component:**
```typescript
export const PermissionGuard = memo<{
  permission: string;
  fallback?: ReactNode;
  children: ReactNode;
}>(({ permission, fallback = null, children }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});
```

### XSS Prevention

**Content Sanitization:**
- Use DOMPurify for user-generated HTML (email templates, custom CSS)
- Never use `dangerouslySetInnerHTML` without sanitization
- Escape user input in all display contexts

**Example:**
```typescript
import DOMPurify from 'dompurify';

export const SanitizedHTML = memo<{ html: string }>(({ html }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
});
```

### CSRF Protection

- All mutating requests (POST/PUT/PATCH/DELETE) send CSRF token
- Token stored in httpOnly cookie (handled by backend)
- Frontend reads from meta tag or API response

### Rate Limiting (Client-Side)

**Debounce Hook for Search/Filter:**
```typescript
export const useDebouncedValue = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

## 11. Performance Strategy

### Code Splitting

**Route-Level Splitting (Automatic with TanStack Router):**
- Each route file is automatically code-split
- Lazy-loaded on navigation

**Component-Level Splitting:**
```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const EmailEditor = lazy(() => import('@/features/emails/components/EmailEditor'));
const FormBuilder = lazy(() => import('@/features/form-builder/components/FormBuilder'));
const ChartWidgets = lazy(() => import('@/features/analytics/components/ChartWidgets'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <EmailEditor />
</Suspense>
```

### Image Optimization

**Lazy Loading Images:**
```typescript
export const OptimizedImage = memo<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}>(({ src, alt, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={styles.image}
    />
  );
});
```

### Virtualization (Large Lists)

**Use react-window for user lists:**
```typescript
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

export const VirtualizedUserList = memo<{ users: User[] }>(({ users }) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      <UserListItem user={users[index]} />
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          itemCount={users.length}
          itemSize={80}
          width={width}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
});
```

### Memoization Strategy

**When to use React.memo:**
- Components that receive same props frequently
- Components that render expensive calculations
- List items that re-render on parent updates

**When to use useMemo:**
- Expensive calculations (filtering, sorting large arrays)
- Object/array creation passed to child props
- Dependencies for other hooks

**When to use useCallback:**
- Functions passed as props to memoized components
- Dependencies for useEffect/useMemo
- Event handlers in optimized lists

### Bundle Size Optimization

**Tree Shaking:**
- Import only what you need: `import { Button } from '@/proto-design-system/Button'`
- Avoid default exports for tree-shaking

**Analyze Bundle:**
```bash
npm run build -- --mode analyze
```

**Target Bundle Sizes:**
- Initial bundle: <200KB gzipped
- Route chunks: <50KB gzipped each
- Widget embed: <50KB gzipped

---

## 12. Testing Strategy

### Test Structure

```
src/
├── features/
│   └── campaigns/
│       ├── components/
│       │   └── CampaignCard/
│       │       ├── component.tsx
│       │       ├── component.test.tsx
│       │       └── component.module.scss
│       └── hooks/
│           ├── useCampaigns.ts
│           └── useCampaigns.test.ts
```

### Testing Patterns

**Component Tests (Vitest + React Testing Library):**
```typescript
// component.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampaignCard } from './component';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('CampaignCard', () => {
  it('renders campaign name', () => {
    render(<CampaignCard campaignId="123" />, { wrapper });
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<CampaignCard campaignId="123" />, { wrapper });
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});
```

**Hook Tests:**
```typescript
// useCampaigns.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCampaigns } from './useCampaigns';

describe('useCampaigns', () => {
  it('fetches campaigns successfully', async () => {
    const { result } = renderHook(() => useCampaigns(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
  });
});
```

### Test Coverage Goals

- Components: 80%+
- Hooks: 90%+
- Utils: 95%+
- Critical paths: 100%

---

## 13. Development Phases

### Phase 1: Foundation (Month 1)

**Week 1-2: Project Setup & Authentication**
- [ ] Set up Vite + React + TypeScript + TanStack Router
- [ ] Install and configure dependencies (React Query, etc.)
- [ ] Create project structure (features/, services/, etc.)
- [ ] Implement design tokens (use existing)
- [ ] Build authentication system:
  - [ ] Login/Signup forms (use existing form components)
  - [ ] Auth context and hooks
  - [ ] Protected route wrapper
  - [ ] 2FA setup component (future)
- [ ] Create base layout components:
  - [ ] AppLayout (sidebar + header + main)
  - [ ] DashboardLayout
  - [ ] AuthLayout

**Week 3-4: Campaign Management Core**
- [ ] Set up React Query with query keys factory
- [ ] Create API service layer (campaigns, users, etc.)
- [ ] Build campaign features:
  - [ ] Campaign list page with cards
  - [ ] Create campaign wizard (multi-step form)
  - [ ] Campaign detail page (overview)
  - [ ] Basic campaign settings
- [ ] User management:
  - [ ] User list with pagination
  - [ ] User profile view
  - [ ] Basic filters (status, date)
  - [ ] CSV import

### Phase 2: Viral Mechanics (Month 2)

**Week 1-2: Referral System**
- [ ] Referral link generation component
- [ ] Share buttons (10+ platforms)
- [ ] Position tracker (real-time)
- [ ] Leaderboard widget
- [ ] Referral tree visualization
- [ ] Social sharing preview cards

**Week 3-4: Form Builder MVP**
- [ ] Form canvas with drag-and-drop
- [ ] Field palette (5 basic types: email, text, textarea, select, checkbox)
- [ ] Live preview (desktop only for MVP)
- [ ] Basic style editor (colors, typography)
- [ ] Embed code generator
- [ ] Public form widget (embeddable)
- [ ] Thank you page with referral prompt

### Phase 3: Email & Analytics (Month 3)

**Week 1-2: Email System**
- [ ] Email template list
- [ ] Basic email editor (text + variables)
- [ ] Automated campaigns (welcome, verification)
- [ ] Email analytics (sent, opened, clicked)
- [ ] Test email functionality

**Week 3-4: Analytics Dashboard**
- [ ] Overview dashboard (KPIs)
- [ ] Growth chart (line chart)
- [ ] Conversion funnel
- [ ] Traffic sources (pie chart)
- [ ] Real-time activity feed
- [ ] Date range selector
- [ ] Export reports (CSV)

### Phase 4: Polish & Launch Prep (Month 3, Cont.)

**Final 2 Weeks:**
- [ ] WebSocket integration for real-time updates
- [ ] Notification system (toast messages)
- [ ] Error boundaries and error handling
- [ ] Loading states and skeletons
- [ ] Empty states
- [ ] Onboarding flow (first-time user)
- [ ] Help documentation (in-app)
- [ ] API documentation (Swagger UI)
- [ ] Beta testing feedback implementation
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive testing

### Phase 5: Growth Features (Month 4-6)

**Month 4:**
- [ ] Reward system (tiers, triggers, delivery)
- [ ] Advanced form builder (conditional logic, multi-step)
- [ ] Form A/B testing
- [ ] Advanced email editor (drag-and-drop)
- [ ] Email A/B testing

**Month 5:**
- [ ] Team collaboration (members, roles, permissions)
- [ ] Activity feed
- [ ] Internal notes
- [ ] Advanced segmentation
- [ ] Bulk operations on users
- [ ] Custom domain for emails

**Month 6:**
- [ ] White-label branding
- [ ] Custom domain for forms
- [ ] Integration marketplace
- [ ] Webhook manager
- [ ] API rate limiting display
- [ ] Advanced analytics (predictive, benchmarks)

### Phase 6: Scale & Innovation (Month 7-9)

**Month 7-8:**
- [ ] Database query optimization
- [ ] API performance improvements
- [ ] Real-time scaling (multi-region WebSocket)
- [ ] ML-based fraud detection
- [ ] Advanced automation builder (visual workflow)

**Month 9:**
- [ ] Mobile app (React Native or native)
- [ ] Push notifications
- [ ] QR code campaigns
- [ ] AI-powered insights
- [ ] Template marketplace

---

## Implementation Guidelines

### Development Workflow

1. **Create Feature Branch:** `git checkout -b feature/campaign-list`
2. **Implement in Order:**
   - Types first (`types/campaign.types.ts`)
   - Service layer (`services/campaigns.service.ts`)
   - React Query hooks (`hooks/useCampaigns.ts`)
   - Components (simple → complex)
   - Routes
   - Styles (use design tokens)
3. **Test:** Write tests alongside implementation
4. **Review:** Self-review checklist:
   - [ ] Uses design tokens (no hardcoded values)
   - [ ] TypeScript strict mode passing
   - [ ] Proper error handling
   - [ ] Loading states
   - [ ] Accessibility (ARIA, keyboard nav)
   - [ ] Mobile responsive
   - [ ] Performance (memo, useCallback where needed)
5. **Commit:** Follow conventional commits (`feat:`, `fix:`, `refactor:`)

### Code Review Checklist

- [ ] Follows existing patterns from CLAUDE.md
- [ ] Uses React Query for server state
- [ ] Proper error handling
- [ ] Loading and empty states
- [ ] TypeScript types defined
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Mobile responsive
- [ ] Design tokens used
- [ ] No console.log statements
- [ ] Tests included
- [ ] Storybook story (for design system components)

### Performance Checklist

- [ ] Component memoized (if needed)
- [ ] Callbacks memoized (if passed to children)
- [ ] Expensive calculations memoized
- [ ] Lists virtualized (if >100 items)
- [ ] Images lazy loaded
- [ ] Routes code-split
- [ ] Bundle size checked

### Security Checklist

- [ ] User input sanitized
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Permissions checked
- [ ] Sensitive data not logged
- [ ] API errors don't leak sensitive info
- [ ] Rate limiting on client side

---

## Appendix A: File Naming Conventions

**Components:**
- Directory: PascalCase (`CampaignCard/`)
- Component file: `component.tsx`
- Styles: `component.module.scss`
- Tests: `component.test.tsx`
- Stories: `component.stories.ts`
- Types (if local): `component.types.ts`

**Hooks:**
- File: camelCase with `use` prefix (`useCampaigns.ts`)
- Tests: `useCampaigns.test.ts`

**Utils:**
- File: kebab-case with `.utils.ts` suffix (`date.utils.ts`)
- Tests: `date.utils.test.ts`

**Types:**
- File: kebab-case with `.types.ts` suffix (`campaign.types.ts`)

**Services:**
- File: kebab-case with `.service.ts` suffix (`campaigns.service.ts`)

**Constants:**
- File: kebab-case (`.ts`) (`api-endpoints.ts`)

---

## Appendix B: Key Dependencies Version Lock

```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@tanstack/react-router": "^1.90.0",
    "@tanstack/react-query": "^5.59.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "recharts": "^2.12.0",
    "socket.io-client": "^4.8.0",
    "zustand": "^5.0.0",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.11.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "6.3.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "sass": "^1.80.0"
  }
}
```

---

## Appendix C: Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_SSO=false
VITE_ENABLE_WHITE_LABEL=true

# Analytics
VITE_GA_TRACKING_ID=
VITE_SENTRY_DSN=

# Stripe (for billing)
VITE_STRIPE_PUBLIC_KEY=

# Widget CDN
VITE_WIDGET_CDN_URL=https://cdn.yourapp.com
```

---

## Document Control

**Version:** 1.0
**Status:** Ready for Implementation
**Last Updated:** November 5, 2025
**Next Review:** After Phase 1 Completion

**Approval Required From:**
- [ ] Lead Frontend Developer
- [ ] CTO/Tech Lead
- [ ] Product Manager

---

**END OF TECHNICAL DESIGN DOCUMENT**

*This document is a living specification. Update as implementation reveals new patterns or requirements change.*
