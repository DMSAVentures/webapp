# Technical Design Document - Frontend Architecture
## Viral Waitlist & Referral Marketing Platform

**Version:** 2.0 - Vanilla React 19
**Last Updated:** November 5, 2025
**Target Implementation:** Phase 1-3 (Months 1-9)
**Stack:** Vite + React 19 + TypeScript + SCSS Modules + TanStack Router

---

## Table of Contents

1. Architecture Overview
2. Application Structure
3. State Management Architecture (Vanilla React 19)
4. Component Architecture
5. Routing & Navigation
6. API Integration Layer (Custom with Suspense)
7. Real-Time Features (Native WebSocket)
8. Form Management System (React 19 Actions)
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
- **Vanilla-first approach**: Write custom code, minimal dependencies

**State Management Philosophy (React 19 Native):**
- Server state via custom cache + Suspense + `use()` hook
- Local UI state via React hooks (useState, useReducer)
- Global app state via React Context + useReducer
- Real-time state via native WebSocket + Context
- Form state via React 19 Actions + useActionState

**Data Flow Pattern:**
- Unidirectional data flow (React standard)
- API → Custom Cache → Suspense Boundary → Components
- WebSocket → Event Handlers → Context Updates → Components
- Forms → Actions → Optimistic Updates → API → Final State

### Technology Decisions

**Core Stack:**
- **React 19.0.0** - Leverage new features:
  - `use()` hook for promises and context
  - `useOptimistic()` for optimistic UI updates
  - `useActionState()` for form handling
  - `useTransition()` for non-blocking updates
  - Enhanced Suspense and Error Boundaries
  - Form Actions
  - `ref` as prop and cleanup functions
- **TypeScript Strict Mode** - Full type safety
- **TanStack Router** - File-based routing with type safety (minimal library, worth it)
- **SCSS Modules + BEM** - Styling (existing pattern)
- **Vite 6.3.0** - Build tool with fast HMR

**Dependencies (Minimal):**
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@tanstack/react-router": "^1.90.0",
    "recharts": "^2.12.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "6.3.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "sass": "^1.80.0"
  }
}
```

**What We're Building Ourselves:**
- ✅ Data fetching layer with caching (no React Query)
- ✅ Form validation (no React Hook Form or Zod)
- ✅ State management (no Zustand)
- ✅ Animations (CSS + Web Animations API, no Framer Motion)
- ✅ Toast notifications (custom)
- ✅ WebSocket client (native)
- ✅ Drag-and-drop (native HTML5)
- ✅ Clipboard (native Clipboard API)
- ✅ QR codes (canvas rendering)
- ✅ Confetti (custom canvas animation)

**Why This Approach:**
- 🎯 Full control over implementation
- 📦 Minimal bundle size
- 🚀 Better performance (no library overhead)
- 🧠 Deep understanding of React 19 features
- 🔧 Easier debugging and maintenance
- 💪 Team learning and ownership

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

## 3. State Management Architecture (Vanilla React 19)

### Custom Data Cache with Suspense

**Cache Implementation (lib/cache.ts):**
```typescript
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
};

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private staleTime = 5 * 60 * 1000; // 5 minutes
  private subscribers = new Map<string, Set<() => void>>();

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if stale
    if (Date.now() - entry.timestamp > this.staleTime) {
      return undefined;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.notify(key);
  }

  getPending<T>(key: string): Promise<T> | undefined {
    return this.cache.get(key)?.promise;
  }

  setPending<T>(key: string, promise: Promise<T>): void {
    const entry = this.cache.get(key) || { data: undefined, timestamp: Date.now() };
    entry.promise = promise;
    this.cache.set(key, entry);
  }

  invalidate(pattern: string | RegExp): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string' ? key.startsWith(pattern) : pattern.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.notify(key);
    });
  }

  subscribe(key: string, callback: () => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  private notify(key: string): void {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach(callback => callback());
    }
  }

  clear(): void {
    this.cache.clear();
    this.subscribers.clear();
  }
}

export const dataCache = new DataCache();
```

### Custom Data Fetching Hook with Suspense

**Fetch Hook (hooks/useFetch.ts):**
```typescript
import { use, useSyncExternalStore } from 'react';
import { dataCache } from '@/lib/cache';
import { fetcher } from '@/hooks/fetcher';

interface FetchOptions<T> {
  /** Function to fetch data */
  fetcher: () => Promise<T>;
  /** Cache key */
  key: string;
  /** Enable/disable fetching */
  enabled?: boolean;
}

export function useFetch<T>({ fetcher: fetchFn, key, enabled = true }: FetchOptions<T>): T {
  // Subscribe to cache updates
  const cachedData = useSyncExternalStore(
    (callback) => dataCache.subscribe(key, callback),
    () => dataCache.get<T>(key),
    () => dataCache.get<T>(key)
  );

  if (!enabled) {
    throw new Error('Fetch disabled - should not render this component');
  }

  // Return cached data if available
  if (cachedData !== undefined) {
    return cachedData;
  }

  // Check if there's a pending promise
  const pendingPromise = dataCache.getPending<T>(key);
  if (pendingPromise) {
    throw pendingPromise; // Suspend until promise resolves
  }

  // Create new fetch promise
  const promise = fetchFn()
    .then(data => {
      dataCache.set(key, data);
      return data;
    })
    .catch(error => {
      dataCache.invalidate(key);
      throw error;
    });

  dataCache.setPending(key, promise);
  throw promise; // Suspend until promise resolves
}
```

### Global App State with Context + useReducer

**App State (contexts/AppContext.tsx):**
```typescript
import { createContext, useReducer, useContext, type ReactNode } from 'react';

// State type
interface AppState {
  currentCampaignId: string | null;
  isWebSocketConnected: boolean;
  sidebarCollapsed: boolean;
  toasts: Toast[];
}

// Action types
type AppAction =
  | { type: 'SET_CAMPAIGN'; payload: string | null }
  | { type: 'SET_WS_CONNECTED'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_TOAST'; payload: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CAMPAIGN':
      return { ...state, currentCampaignId: action.payload };

    case 'SET_WS_CONNECTED':
      return { ...state, isWebSocketConnected: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: crypto.randomUUID() }],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// Context
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    currentCampaignId: null,
    isWebSocketConnected: false,
    sidebarCollapsed: false,
    toasts: [],
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Hooks
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) throw new Error('useAppDispatch must be used within AppProvider');
  return context;
}

// Convenience hooks
export function useToast() {
  const dispatch = useAppDispatch();

  return {
    showToast: (toast: Omit<Toast, 'id'>) => {
      dispatch({ type: 'ADD_TOAST', payload: toast });

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
      }, 5000);
    },
    hideToast: (id: string) => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    },
  };
}
```

### State Management Patterns

**Pattern 1: Server State (Custom Cache + Suspense)**
Use for ALL API data:
- Campaign data, user lists, analytics, email templates, team members
- Automatic caching with staleTime
- Suspense boundaries for loading states
- Error boundaries for error handling

**Pattern 2: Local UI State (useState/useReducer)**
Use for component-specific state:
- Form inputs, modal open/close, accordion expanded/collapsed
- Selected items, filter states (before applying)
- Loading states for UI interactions (use `useTransition` for non-blocking)

**Pattern 3: Global App State (Context + useReducer)**
Use sparingly for cross-cutting concerns:
- Current workspace/campaign selection
- Toast notifications
- Real-time connection status
- User preferences (theme, language)

**Pattern 4: Optimistic Updates (useOptimistic)**
Use for immediate UI feedback:
- Form submissions
- Toggling favorites/likes
- Reordering lists
- Updating status

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

## 6. API Integration Layer (Custom with Suspense)

### Service Layer (Keep Existing Pattern)

**Campaign Service (services/campaigns.service.ts):**
```typescript
import { fetcher } from '@/hooks/fetcher';
import type { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL;

export const campaignsService = {
  list: (params?: { status?: string; search?: string }) => {
    const url = new URL(`${API_BASE}/api/campaigns`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }
    return fetcher<Campaign[]>(url.toString());
  },

  get: (id: string) => fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`),

  create: (data: CreateCampaignRequest) =>
    fetcher<Campaign>(`${API_BASE}/api/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateCampaignRequest) =>
    fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetcher<void>(`${API_BASE}/api/campaigns/${id}`, { method: 'DELETE' }),
};
```

### Custom Hooks with Suspense

**Data Fetching Hook (features/campaigns/hooks/useCampaigns.ts):**
```typescript
import { useFetch } from '@/hooks/useFetch';
import { campaignsService } from '@/services/campaigns.service';

// GET - List campaigns (with Suspense)
export function useCampaigns(filters?: { status?: string; search?: string }) {
  const key = `campaigns:list:${JSON.stringify(filters || {})}`;

  const campaigns = useFetch({
    key,
    fetcher: () => campaignsService.list(filters),
  });

  return campaigns;
}

// GET - Single campaign (with Suspense)
export function useCampaign(id: string | null) {
  const key = id ? `campaigns:${id}` : '';

  const campaign = useFetch({
    key,
    fetcher: () => campaignsService.get(id!),
    enabled: !!id,
  });

  return campaign;
}
```

**Mutation Hook Pattern:**
```typescript
import { useState, useTransition, useOptimistic } from 'react';
import { dataCache } from '@/lib/cache';
import { campaignsService } from '@/services/campaigns.service';
import { useToast } from '@/contexts/AppContext';

// POST - Create campaign
export function useCreateCampaign() {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const createCampaign = async (data: CreateCampaignRequest) => {
    try {
      const newCampaign = await campaignsService.create(data);

      // Invalidate cache to trigger refetch
      dataCache.invalidate('campaigns:list');
      // Add to cache
      dataCache.set(`campaigns:${newCampaign.id}`, newCampaign);

      showToast({ type: 'success', message: 'Campaign created!' });
      return newCampaign;
    } catch (error: any) {
      showToast({ type: 'error', message: error.message });
      throw error;
    }
  };

  const mutate = (data: CreateCampaignRequest) => {
    startTransition(() => {
      createCampaign(data);
    });
  };

  return { mutate, isPending };
}

// PATCH - Update campaign (with optimistic updates)
export function useUpdateCampaign(id: string) {
  const { showToast } = useToast();
  const [optimisticCampaign, setOptimisticCampaign] = useOptimistic(
    dataCache.get<Campaign>(`campaigns:${id}`)
  );

  const updateCampaign = async (updates: Partial<Campaign>) => {
    // Optimistic update
    setOptimisticCampaign((current) => ({ ...current, ...updates }));

    try {
      const updated = await campaignsService.update(id, updates);
      dataCache.set(`campaigns:${id}`, updated);
      dataCache.invalidate('campaigns:list');
      showToast({ type: 'success', message: 'Campaign updated!' });
      return updated;
    } catch (error: any) {
      // Revert on error
      dataCache.invalidate(`campaigns:${id}`);
      showToast({ type: 'error', message: error.message });
      throw error;
    }
  };

  return { updateCampaign, optimisticCampaign };
}
```

### Component Usage Pattern

**With Suspense Boundary:**
```typescript
// features/campaigns/components/CampaignList/component.tsx
import { Suspense } from 'react';
import { useCampaigns } from '../../hooks/useCampaigns';

function CampaignListContent() {
  const campaigns = useCampaigns(); // Suspends while loading

  return (
    <div>
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

export function CampaignList() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CampaignListContent />
    </Suspense>
  );
}
```

### Pagination Pattern (Custom Infinite Scroll)

**Infinite Scroll Hook:**
```typescript
import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll<T>(
  fetchPage: (page: number) => Promise<T[]>,
  pageSize = 50
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const loadMore = async () => {
      setIsLoading(true);
      try {
        const newItems = await fetchPage(page);
        setItems(prev => [...prev, ...newItems]);
        setHasMore(newItems.length === pageSize);
        setPage(prev => prev + 1);
      } catch (error) {
        console.error('Failed to load more:', error);
      } finally {
        setIsLoading(false);
      }
    };

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [page, hasMore, isLoading]);

  return { items, isLoading, hasMore, lastElementRef };
}

---

## 7. Real-Time Features (Native WebSocket)

### Native WebSocket Manager

**Connection Management (lib/websocket.ts):**
```typescript
type EventCallback = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers = new Map<string, Set<EventCallback>>();
  private messageQueue: any[] = [];

  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}?userId=${userId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;

      // Flush message queue
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.send(msg.event, msg.data);
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message.event, message.data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(userId);
    };
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect(userId);
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(event: string, callback: EventCallback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: EventCallback) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }

  send(event: string, data?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    } else {
      // Queue message for later
      this.messageQueue.push({ event, data });
    }
  }

  private handleMessage(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();
```

### WebSocket Context

**Context Provider (contexts/WebSocketContext.tsx):**
```typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { wsManager } from '@/lib/websocket';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { dataCache } from '@/lib/cache';

interface WebSocketContextValue {
  isConnected: boolean;
  send: (event: string, data?: any) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    wsManager.connect(user.id);

    // Track connection status
    const checkConnection = setInterval(() => {
      setIsConnected(wsManager.isConnected());
    }, 1000);

    // Subscribe to real-time events and invalidate cache
    const unsubscribers = [
      wsManager.on('user:created', (data) => {
        dataCache.invalidate(`users:list:${data.campaignId}`);
        dataCache.invalidate(`campaigns:${data.campaignId}`);
      }),

      wsManager.on('referral:created', (data) => {
        dataCache.invalidate(`referrals:user:${data.userId}`);
      }),

      wsManager.on('position:updated', (data) => {
        dataCache.invalidate(`users:${data.userId}`);
      }),

      wsManager.on('leaderboard:updated', (data) => {
        dataCache.invalidate(`leaderboard:${data.campaignId}`);
      }),

      wsManager.on('campaign:milestone', (data) => {
        dataCache.invalidate(`campaigns:${data.campaignId}`);
      }),
    ];

    return () => {
      clearInterval(checkConnection);
      unsubscribers.forEach(unsub => unsub());
      wsManager.disconnect();
    };
  }, [user?.id]);

  return (
    <WebSocketContext.Provider value={{ isConnected, send: wsManager.send.bind(wsManager) }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
  return context;
}
```

### Custom Confetti Animation

**Confetti Component (components/Confetti/component.tsx):**
```typescript
import { useEffect, useRef, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
}

export const Confetti = memo<{ recycle?: boolean; numberOfPieces?: number }>(({
  recycle = false,
  numberOfPieces = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    // Initialize particles
    particles.current = Array.from({ length: numberOfPieces }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.current.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.1; // Gravity

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Reset if off-screen
        if (p.y > canvas!.height) {
          if (recycle) {
            p.y = -10;
            p.x = Math.random() * canvas!.width;
          } else {
            particles.current.splice(i, 1);
          }
        }
      });

      if (particles.current.length > 0 || recycle) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [recycle, numberOfPieces]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
});

---

## 8. Form Management System (React 19 Actions)

### Custom Form Validation

**Validation Utils (utils/validation.utils.ts):**
```typescript
export type ValidationRule<T = any> = {
  validate: (value: T) => boolean;
  message: string;
};

export type FieldValidation<T = any> = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: ValidationRule<T>[];
};

export function validateField<T>(
  value: T,
  rules: FieldValidation<T>
): string | null {
  // Required check
  if (rules.required) {
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
      return typeof rules.required === 'string'
        ? rules.required
        : 'This field is required';
    }
  }

  // Min length
  if (rules.minLength && typeof value === 'string') {
    if (value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
  }

  // Max length
  if (rules.maxLength && typeof value === 'string') {
    if (value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }
  }

  // Pattern
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  }

  // Custom validators
  if (rules.custom) {
    for (const rule of rules.custom) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
  }

  return null;
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, FieldValidation>
): Record<keyof T, string | null> {
  const errors = {} as Record<keyof T, string | null>;

  for (const key in schema) {
    errors[key] = validateField(data[key], schema[key]);
  }

  return errors;
}
```

### Form Hook with React 19 useActionState

**Custom Form Hook (hooks/useForm.ts):**
```typescript
import { useActionState, useOptimistic, useState } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<{ success: boolean; error?: string }>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // React 19 useActionState for form submission
  const [state, submitAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Convert FormData to values object
      const formValues = Object.fromEntries(formData) as T;

      // Validate
      if (validate) {
        const validationErrors = validate(formValues);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return { success: false, errors: validationErrors };
        }
      }

      // Submit
      try {
        const result = await onSubmit(formValues);
        if (result.success) {
          // Reset form on success
          setValues(initialValues);
          setErrors({});
          setTouched({});
        }
        return result;
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    { success: false }
  );

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    if (validate && touched[name]) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
      }
    }
  };

  return {
    values,
    errors,
    touched,
    isPending,
    submitAction,
    handleChange,
    handleBlur,
    setFieldError: (name: keyof T, error: string) =>
      setErrors((prev) => ({ ...prev, [name]: error })),
  };
}
```

### Form Component Pattern

**Example: Campaign Form:**
```typescript
import { memo } from 'react';
import { useForm } from '@/hooks/useForm';
import { TextInput } from '@/proto-design-system/TextInput';
import { Button } from '@/proto-design-system/Button';
import styles from './component.module.scss';

interface CampaignFormData {
  name: string;
  description: string;
  redirectUrl: string;
}

export const CampaignForm = memo<{
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => Promise<{ success: boolean; error?: string }>;
}>(({ initialData, onSubmit }) => {
  const { values, errors, touched, isPending, submitAction, handleChange, handleBlur } =
    useForm({
      initialValues: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        redirectUrl: initialData?.redirectUrl || '',
      },
      validate: (values) => {
        const errors: any = {};

        if (!values.name || values.name.length < 3) {
          errors.name = 'Name must be at least 3 characters';
        }

        if (values.name && values.name.length > 100) {
          errors.name = 'Name must be less than 100 characters';
        }

        if (values.description && values.description.length > 500) {
          errors.description = 'Description must be less than 500 characters';
        }

        if (values.redirectUrl && !/^https?:\/\/.+/.test(values.redirectUrl)) {
          errors.redirectUrl = 'Please enter a valid URL';
        }

        return errors;
      },
      onSubmit,
    });

  return (
    <form action={submitAction} className={styles.form}>
      <TextInput
        name="name"
        label="Campaign Name"
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
        error={touched.name ? errors.name : undefined}
        required
      />

      <textarea
        name="description"
        placeholder="Describe your campaign..."
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
        onBlur={() => handleBlur('description')}
        className={styles.textarea}
      />
      {touched.description && errors.description && (
        <span className={styles.error}>{errors.description}</span>
      )}

      <TextInput
        name="redirectUrl"
        label="Redirect URL (optional)"
        type="url"
        value={values.redirectUrl}
        onChange={(e) => handleChange('redirectUrl', e.target.value)}
        onBlur={() => handleBlur('redirectUrl')}
        error={touched.redirectUrl ? errors.redirectUrl : undefined}
      />

      <Button type="submit" loading={isPending}>
        {initialData ? 'Update Campaign' : 'Create Campaign'}
      </Button>
    </form>
  );
});
```

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
