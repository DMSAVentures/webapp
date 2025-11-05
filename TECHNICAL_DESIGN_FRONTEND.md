# Technical Design Document - Frontend Architecture
## Viral Waitlist & Referral Marketing Platform

**Version:** 3.0 - Specification for Implementation
**Last Updated:** November 5, 2025
**Target:** AI Agent Implementation
**Stack:** Vite + React 19 + TypeScript + SCSS Modules + TanStack Router

> **Purpose:** This document specifies data types, component requirements, and architectural decisions. Implementation follows patterns from CLAUDE.md.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dependencies](#2-dependencies)
3. [Type Definitions](#3-type-definitions)
4. [Application Structure](#4-application-structure)
5. [State Management Strategy](#5-state-management-strategy)
6. [Data Fetching Strategy](#6-data-fetching-strategy)
7. [Form Handling Strategy](#7-form-handling-strategy)
8. [Real-Time Updates Strategy](#8-real-time-updates-strategy)
9. [Component Specifications](#9-component-specifications)
10. [Routing Structure](#10-routing-structure)
11. [Development Phases](#11-development-phases)

---

## 1. Architecture Overview

### Core Principles
- **Feature-based structure** - Organize by domain (campaigns, users, referrals, etc.)
- **Vanilla React 19** - Use built-in features, minimal external dependencies
- **Follow CLAUDE.md** - Use existing component patterns, styling conventions
- **Type-safe** - Full TypeScript coverage with strict mode

### Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| State Management | useState + useReducer + Context | React built-ins only |
| Data Fetching | Suspense + in-memory cache | React 19 native |
| Form Handling | useActionState + manual validation | No Zod, no RHF |
| Real-Time | Polling (Phase 1) | Simple, no WebSocket initially |
| Styling | SCSS Modules + BEM | Existing pattern |
| Components | Follow CLAUDE.md patterns | Consistency |
| Routing | TanStack Router | Type-safe routes |
| Charts | Recharts | Only for complex charts |

---

## 2. Dependencies

**Final Dependencies (Only 3!):**
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@tanstack/react-router": "^1.90.0",
    "recharts": "^2.12.0",
    "date-fns": "^4.1.0"
  }
}
```

**NOT Using:**
- ❌ React Query/TanStack Query
- ❌ Zustand/Redux
- ❌ React Hook Form
- ❌ Zod/Yup
- ❌ Framer Motion
- ❌ Socket.io
- ❌ Any other state/form/animation libraries

---

## 3. Type Definitions

### Core Types

```typescript
// types/common.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  formConfig: FormConfig;
  settings: CampaignSettings;
  stats: CampaignStats;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CampaignSettings {
  redirectUrl?: string;
  emailVerificationRequired: boolean;
  duplicateHandling: 'block' | 'update' | 'allow';
  enableReferrals: boolean;
  enableRewards: boolean;
}

export interface CampaignStats {
  totalSignups: number;
  verifiedSignups: number;
  totalReferrals: number;
  conversionRate: number;
  viralCoefficient: number;
}

export interface WaitlistUser {
  id: string;
  campaignId: string;
  email: string;
  name?: string;
  customFields: Record<string, any>;
  status: 'pending' | 'verified' | 'invited' | 'active' | 'rejected';
  position: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  points: number;
  source: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    device?: 'mobile' | 'tablet' | 'desktop';
  };
  createdAt: Date;
  verifiedAt?: Date;
  invitedAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  campaignId: string;
  status: 'clicked' | 'signed_up' | 'verified' | 'converted';
  source: 'link' | 'email' | 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'other';
  createdAt: Date;
  verifiedAt?: Date;
}

export interface FormConfig {
  id: string;
  campaignId: string;
  fields: FormField[];
  design: FormDesign;
  behavior: FormBehavior;
}

export interface FormField {
  id: string;
  type: 'email' | 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'phone' | 'url' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[]; // For select/radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number; // For number
    max?: number; // For number
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

export interface FormDesign {
  layout: 'single-column' | 'two-column' | 'multi-step';
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    error: string;
    success: string;
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
  borderRadius: number;
  customCss?: string;
}

export interface FormBehavior {
  submitAction: 'inline-message' | 'redirect' | 'referral-page';
  redirectUrl?: string;
  successMessage?: string;
  doubleOptIn: boolean;
  duplicateHandling: 'block' | 'update' | 'allow';
}

export interface Reward {
  id: string;
  campaignId: string;
  name: string;
  description: string;
  type: 'early_access' | 'discount' | 'premium_feature' | 'merchandise' | 'custom';
  value?: string; // e.g., "20% off", "Free for 6 months"
  tier: number;
  triggerType: 'referral_count' | 'position' | 'manual';
  triggerValue?: number; // e.g., 5 referrals, top 100 position
  status: 'active' | 'inactive';
  inventory?: number;
  expiryDate?: Date;
  deliveryMethod: 'email' | 'dashboard' | 'api_webhook';
  createdAt: Date;
}

export interface RewardEarned {
  id: string;
  userId: string;
  rewardId: string;
  status: 'pending' | 'earned' | 'delivered' | 'redeemed' | 'revoked' | 'expired';
  earnedAt: Date;
  deliveredAt?: Date;
  redeemedAt?: Date;
  expiresAt?: Date;
  deliveryDetails?: {
    code?: string;
    instructions?: string;
  };
}

export interface EmailTemplate {
  id: string;
  campaignId: string;
  name: string;
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent?: string;
  type: 'welcome' | 'verification' | 'position_update' | 'milestone' | 'invitation' | 'launch' | 'custom';
  variables: string[]; // e.g., ['first_name', 'position', 'referral_link']
  status: 'draft' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  campaignId: string;
  name: string;
  templateId: string;
  segmentId?: string;
  trigger: 'manual' | 'signup' | 'verified' | 'milestone' | 'scheduled' | 'inactive';
  triggerConfig?: {
    days?: number;
    hours?: number;
    milestoneType?: string;
    milestoneValue?: number;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduledFor?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: Date;
  sentAt?: Date;
}

export interface Analytics {
  campaignId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  overview: {
    totalSignups: number;
    todaySignups: number;
    verificationRate: number;
    referralRate: number;
    viralCoefficient: number;
    avgReferralsPerUser: number;
  };
  funnel: {
    impressions: number;
    started: number;
    submitted: number;
    verified: number;
    referred: number;
  };
  trafficSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  referralSources: {
    platform: string;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }[];
  geographic: {
    country: string;
    count: number;
    percentage: number;
  }[];
  devices: {
    type: 'mobile' | 'tablet' | 'desktop';
    count: number;
    percentage: number;
  }[];
  timeline: {
    date: string;
    signups: number;
    referrals: number;
    verifications: number;
  }[];
}

export interface Leaderboard {
  campaignId: string;
  period: 'all_time' | 'daily' | 'weekly' | 'monthly';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  referralCount: number;
  points: number;
  badges: string[];
}

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invitedAt: Date;
  joinedAt?: Date;
  lastActiveAt?: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'zapier' | 'webhook' | 'mailchimp' | 'hubspot' | 'salesforce' | 'google_analytics' | 'facebook_pixel' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  lastSyncedAt?: Date;
  createdAt: Date;
}

export interface Webhook {
  id: string;
  campaignId: string;
  name: string;
  url: string;
  events: ('user.created' | 'user.verified' | 'referral.created' | 'reward.earned' | 'campaign.milestone')[];
  status: 'active' | 'inactive';
  secret?: string;
  headers?: Record<string, string>;
  retryConfig: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
  stats: {
    totalAttempts: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    lastDeliveryAt?: Date;
    lastSuccess?: Date;
    lastFailure?: Date;
  };
  createdAt: Date;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  error: string;
  details?: any;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

---

## 4. Application Structure

```
src/
├── features/                      # Feature modules
│   ├── campaigns/
│   │   ├── components/
│   │   │   ├── CampaignCard/
│   │   │   ├── CampaignForm/
│   │   │   ├── CampaignList/
│   │   │   └── CampaignStats/
│   │   ├── hooks/
│   │   │   ├── useCampaigns.ts
│   │   │   ├── useCreateCampaign.ts
│   │   │   └── useUpdateCampaign.ts
│   │   └── types/
│   │       └── campaign.types.ts
│   │
│   ├── form-builder/              # Drag-drop form builder
│   ├── users/                     # Waitlist user management
│   ├── referrals/                 # Viral referral system
│   ├── analytics/                 # Analytics dashboard
│   ├── emails/                    # Email automation
│   ├── rewards/                   # Reward system
│   ├── team/                      # Team collaboration
│   ├── integrations/              # Third-party integrations
│   └── auth/                      # Authentication
│
├── proto-design-system/           # Existing (keep as-is)
│
├── contexts/                      # Global contexts
│   ├── AppContext.tsx             # App state
│   └── AuthContext.tsx            # Auth state
│
├── hooks/                         # Shared hooks
│   ├── fetcher.ts                 # Existing HTTP client
│   ├── useFetch.ts                # Data fetching with Suspense
│   ├── usePolling.ts              # Polling for real-time
│   └── useDebounce.ts             # Input debouncing
│
├── lib/                           # Core utilities
│   ├── cache.ts                   # In-memory data cache
│   └── validation.ts              # Form validation utilities
│
├── services/                      # API services
│   ├── campaigns.service.ts
│   ├── users.service.ts
│   ├── referrals.service.ts
│   ├── analytics.service.ts
│   └── emails.service.ts
│
├── types/                         # TypeScript types
│   ├── common.types.ts            # Core types (above)
│   └── api.types.ts               # API types
│
├── utils/                         # Utilities
│   ├── date.utils.ts
│   ├── number.utils.ts
│   └── url.utils.ts
│
├── routes/                        # TanStack Router routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── campaigns/
│   ├── analytics/
│   ├── team/
│   ├── integrations/
│   ├── settings/
│   └── auth/
│
└── design-tokens/                 # Existing (keep as-is)
```

---

## 5. State Management Strategy

### Use React Built-ins Only

**Component State:**
- `useState` for simple state
- `useReducer` for complex state
- Follow patterns from CLAUDE.md

**Global State:**
```typescript
// contexts/AppContext.tsx
interface AppState {
  currentCampaignId: string | null;
  sidebarCollapsed: boolean;
  toasts: Toast[];
}

// Split by concern, don't create one giant context
```

**Server Data:**
- Fetch with existing `fetcher` from CLAUDE.md
- Cache in `lib/cache.ts` (simple Map)
- Use `<Suspense>` for loading states
- Use React 19's `use()` hook for promises

**Optimistic Updates:**
- Use `useOptimistic()` for instant feedback
- Revert on error

---

## 6. Data Fetching Strategy

### Pattern

1. **Service Layer** - API calls using existing `fetcher`
2. **Cache Layer** - Simple Map in `lib/cache.ts`
3. **Hook Layer** - Custom hooks that check cache, then fetch
4. **Component Layer** - Wrap in `<Suspense>` for loading

### Service Example
```typescript
// services/campaigns.service.ts
import { fetcher } from '@/hooks/fetcher';

const API_BASE = import.meta.env.VITE_API_URL;

export const campaignsService = {
  list: (params?: { status?: string }) =>
    fetcher<Campaign[]>(`${API_BASE}/api/campaigns`, params),

  get: (id: string) =>
    fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`),

  create: (data: CreateCampaignRequest) =>
    fetcher<Campaign>(`${API_BASE}/api/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Campaign>) =>
    fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetcher<void>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'DELETE',
    }),
};
```

### Cache Keys
```
"campaigns:list"
"campaigns:list:{"status":"active"}"
"campaigns:{id}"
"users:list:{campaignId}"
"users:{id}"
"analytics:{campaignId}:{dateRange}"
"leaderboard:{campaignId}"
```

---

## 7. Form Handling Strategy

### Use React 19 Actions

**No Zod. No React Hook Form.** Manual validation with `useActionState`.

### Validation Pattern
```typescript
// utils/validation.ts
export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
  return null;
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (!value) return `${fieldName} is required`;
  return null;
}

export function validateLength(
  value: string,
  min?: number,
  max?: number
): string | null {
  if (min && value.length < min) return `Must be at least ${min} characters`;
  if (max && value.length > max) return `Must be less than ${max} characters`;
  return null;
}
```

### Form Hook Pattern
```typescript
// hooks/useForm.ts
export function useForm<T>(options: {
  initialValues: T;
  validate?: (values: T) => Record<keyof T, string | null>;
  onSubmit: (values: T) => Promise<void>;
}) {
  // Use useActionState for form submission
  // Return: values, errors, touched, isPending, submitAction
}
```

---

## 8. Real-Time Updates Strategy

### Phase 1: Polling (Simple)

**Decision:** Start with polling. WebSocket later if needed.

**Polling Hook:**
```typescript
// hooks/usePolling.ts
export function usePolling(
  cacheKey: string,
  fetchFn: () => Promise<any>,
  interval = 10000 // 10 seconds
) {
  // Poll API every interval
  // Update cache on response
  // Components using useFetch will auto-update
}
```

**Where to Poll:**
- Leaderboard (10s)
- Position tracker (10s)
- Live activity feed (15s)
- Dashboard stats (30s)

---

## 9. Component Specifications

### 9.1 Campaign Components

#### CampaignCard
**Purpose:** Display campaign summary in list/grid view

**Props:**
```typescript
interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
  showStats?: boolean;
  actions?: {
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
  };
}
```

**What it does:**
- Displays campaign name, status badge, creation date
- Shows quick stats if `showStats=true`: signups, viral coefficient
- Click anywhere navigates to campaign detail
- Hover shows action menu (edit, duplicate, delete)
- Uses Card component from proto-design-system
- Status badge colors: draft (gray), active (green), paused (yellow), completed (blue)

#### CampaignForm
**Purpose:** Create/edit campaign

**Props:**
```typescript
interface CampaignFormProps {
  initialData?: Partial<Campaign>;
  onSubmit: (data: CreateCampaignRequest) => Promise<void>;
  onCancel?: () => void;
}

interface CreateCampaignRequest {
  name: string;
  description?: string;
  settings: {
    emailVerificationRequired: boolean;
    duplicateHandling: 'block' | 'update' | 'allow';
    enableReferrals: boolean;
    enableRewards: boolean;
  };
}
```

**What it does:**
- Text input for name (required, 3-100 chars)
- Textarea for description (optional, max 500 chars)
- Checkboxes for settings
- Uses useActionState for submission
- Validates on blur
- Shows loading state on submit button
- Shows error messages inline under fields

#### CampaignList
**Purpose:** List/grid of campaigns with filters

**Props:**
```typescript
interface CampaignListProps {
  view?: 'list' | 'grid';
  showFilters?: boolean;
}
```

**What it does:**
- Fetches campaigns with useCampaigns() hook
- Wraps in Suspense (shows skeleton while loading)
- Filter by status: all, draft, active, paused, completed
- Search by name (debounced 300ms)
- Toggle list/grid view
- Empty state with "Create Campaign" CTA
- Each card links to campaign detail page

#### CampaignStats
**Purpose:** Display campaign statistics

**Props:**
```typescript
interface CampaignStatsProps {
  campaignId: string;
  showChart?: boolean;
}
```

**What it does:**
- Displays 4 KPI cards: Total Signups, Verified, Referrals, K-Factor
- Optional growth chart (7-day trend)
- Uses Recharts LineChart for visualization
- Polls data every 30 seconds with usePolling

---

### 9.2 Form Builder Components

#### FormBuilder
**Purpose:** Visual form editor with drag-drop

**Props:**
```typescript
interface FormBuilderProps {
  campaignId: string;
  initialConfig?: FormConfig;
  onSave: (config: FormConfig) => Promise<void>;
}
```

**What it does:**
- Left panel: Field palette (email, text, textarea, select, etc.)
- Center: Canvas (drop zone for fields)
- Right panel: Field settings + style editor
- Uses HTML5 drag-drop API
- Save button (triggers onSave)
- Real-time preview toggle (mobile/desktop)
- Auto-save every 10 seconds to localStorage

#### FieldPalette
**Purpose:** Draggable field types

**Props:**
```typescript
interface FieldPaletteProps {
  onFieldSelect: (fieldType: FormField['type']) => void;
}
```

**What it does:**
- Lists all available field types
- Each field is draggable
- Icon + label for each type
- Click to add field to canvas

#### FormCanvas
**Purpose:** Drop zone for form fields

**Props:**
```typescript
interface FormCanvasProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId?: string;
}
```

**What it does:**
- Drop zone for fields from palette
- Displays fields in order
- Reorder fields via drag-drop
- Click field to select (shows in right panel)
- Delete field button on hover
- Selected field has blue border

#### FormPreview
**Purpose:** Live preview of form

**Props:**
```typescript
interface FormPreviewProps {
  config: FormConfig;
  device?: 'mobile' | 'tablet' | 'desktop';
}
```

**What it does:**
- Renders form exactly as end-users see it
- Apply all design settings (colors, fonts, spacing)
- Not interactive (just visual preview)
- Responsive frame based on device prop

#### FormStyleEditor
**Purpose:** Edit form design

**Props:**
```typescript
interface FormStyleEditorProps {
  design: FormDesign;
  onChange: (design: FormDesign) => void;
}
```

**What it does:**
- Color pickers for primary, background, text, border
- Font selector (Google Fonts dropdown)
- Number inputs for fontSize, spacing, borderRadius
- Textarea for custom CSS (optional)
- Changes update FormPreview in real-time

---

### 9.3 User/Waitlist Components

#### UserList
**Purpose:** Display waitlist users with filters

**Props:**
```typescript
interface UserListProps {
  campaignId: string;
}
```

**What it does:**
- Fetches users with infinite scroll
- Virtual scrolling for 10,000+ users
- Columns: Email, Name, Status, Position, Referrals, Source, Date
- Sortable columns
- Multi-select for bulk actions
- Filters: Status, date range, source, has referrals
- Search email/name (debounced)
- Export CSV button

#### UserProfile
**Purpose:** User detail modal

**Props:**
```typescript
interface UserProfileProps {
  userId: string;
  onClose: () => void;
}
```

**What it does:**
- Display all user details
- Show referral tree (who they referred)
- Show rewards earned
- Email activity timeline
- Actions: Send email, update status, delete
- Close button (X)

#### BulkActions
**Purpose:** Bulk operations toolbar

**Props:**
```typescript
interface BulkActionsProps {
  selectedUserIds: string[];
  onAction: (action: string) => Promise<void>;
  onClearSelection: () => void;
}
```

**What it does:**
- Shows count: "12 users selected"
- Action buttons: Send Email, Update Status, Export, Delete
- Clear selection button
- Confirmation modal for destructive actions

#### UserFilters
**Purpose:** Filter panel

**Props:**
```typescript
interface UserFiltersProps {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
  onReset: () => void;
}

interface UserFilters {
  status?: WaitlistUser['status'][];
  dateRange?: { start: Date; end: Date };
  source?: string[];
  hasReferrals?: boolean;
  minPosition?: number;
  maxPosition?: number;
}
```

**What it does:**
- Multi-select for status
- Date range picker
- Multi-select for sources
- Checkbox: "Has referrals"
- Number inputs for position range
- Apply/Reset buttons

---

### 9.4 Referral Components

#### ReferralDashboard
**Purpose:** User-facing referral progress

**Props:**
```typescript
interface ReferralDashboardProps {
  userId: string;
  campaignId: string;
}
```

**What it does:**
- Shows user's position (#123)
- Shows referral count (You referred 5 people)
- Referral link with copy button
- Social share buttons (10+ platforms)
- Progress bar to next reward tier
- Leaderboard position badge
- Confetti animation when position improves

#### ReferralLink
**Purpose:** Copyable referral link

**Props:**
```typescript
interface ReferralLinkProps {
  referralCode: string;
  onCopy?: () => void;
}
```

**What it does:**
- Display full referral URL
- Copy button (uses Clipboard API)
- Shows "Copied!" toast on click
- QR code button (opens modal with QR code)

#### ShareButtons
**Purpose:** Social sharing buttons

**Props:**
```typescript
interface ShareButtonsProps {
  referralUrl: string;
  message?: string;
  onShare?: (platform: string) => void;
}
```

**What it does:**
- Buttons for: Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Email, Copy Link
- Each button opens share dialog/URL
- Track clicks (calls onShare callback)
- Optimized message per platform
- Icon + label layout

#### LeaderboardWidget
**Purpose:** Display top referrers

**Props:**
```typescript
interface LeaderboardWidgetProps {
  campaignId: string;
  limit?: number;
  period?: 'all_time' | 'daily' | 'weekly' | 'monthly';
  highlightUserId?: string;
}
```

**What it does:**
- Fetch leaderboard data
- Show top N users (default 10)
- Columns: Rank, Name, Referrals, Points, Badges
- Highlight current user row (if in top N)
- Badge icons for achievements
- Poll every 10 seconds for updates
- Animate rank changes

#### PositionTracker
**Purpose:** Live position display

**Props:**
```typescript
interface PositionTrackerProps {
  userId: string;
}
```

**What it does:**
- Display current position: #123
- Show total waitlist size: "of 5,432"
- Percentile: "Top 2%"
- Poll every 10 seconds
- Animate when position improves
- Show confetti on big improvement (>10 spots)

---

### 9.5 Analytics Components

#### AnalyticsDashboard
**Purpose:** Campaign analytics overview

**Props:**
```typescript
interface AnalyticsDashboardProps {
  campaignId: string;
  dateRange?: { start: Date; end: Date };
}
```

**What it does:**
- Date range selector
- KPI cards: Signups, Conversions, K-Factor, Avg Referrals
- Growth chart (time series)
- Conversion funnel
- Traffic sources pie chart
- Geographic map (optional, Phase 2)
- Real-time activity feed
- Export button

#### GrowthChart
**Purpose:** Time-series line chart

**Props:**
```typescript
interface GrowthChartProps {
  data: { date: string; signups: number; referrals: number }[];
  height?: number;
}
```

**What it does:**
- Uses Recharts LineChart
- Two lines: Signups (blue), Referrals (green)
- X-axis: Dates
- Y-axis: Count
- Tooltip on hover
- Legend
- Responsive

#### ConversionFunnel
**Purpose:** Funnel visualization

**Props:**
```typescript
interface ConversionFunnelProps {
  data: {
    impressions: number;
    started: number;
    submitted: number;
    verified: number;
    referred: number;
  };
}
```

**What it does:**
- Uses Recharts BarChart (horizontal)
- 5 stages with conversion rates
- Color-coded bars
- Percentage labels
- Identifies biggest drop-off

#### TrafficSources
**Purpose:** Pie/bar chart of sources

**Props:**
```typescript
interface TrafficSourcesProps {
  data: { source: string; count: number; percentage: number }[];
  chartType?: 'pie' | 'bar';
}
```

**What it does:**
- Uses Recharts PieChart or BarChart
- Color-coded sources
- Legend with percentages
- Tooltip with exact counts

---

### 9.6 Email Components

#### EmailTemplateList
**Purpose:** List email templates

**Props:**
```typescript
interface EmailTemplateListProps {
  campaignId: string;
  onSelect?: (templateId: string) => void;
}
```

**What it does:**
- Fetches templates
- Cards with template name, type, status
- Preview button (opens modal)
- Edit button
- Duplicate button
- Delete button
- Create new template button

#### EmailEditor
**Purpose:** WYSIWYG email editor

**Props:**
```typescript
interface EmailEditorProps {
  initialContent?: string;
  variables: string[];
  onChange: (html: string) => void;
}
```

**What it does:**
- Rich text editor (contenteditable)
- Toolbar: Bold, Italic, Link, Image, Variables dropdown
- Insert variable button (dropdown with {{first_name}}, etc.)
- Live preview toggle
- Mobile/desktop preview
- Save button

#### EmailCampaignForm
**Purpose:** Create email campaign

**Props:**
```typescript
interface EmailCampaignFormProps {
  campaignId: string;
  onSubmit: (data: CreateEmailCampaignRequest) => Promise<void>;
}

interface CreateEmailCampaignRequest {
  name: string;
  templateId: string;
  segmentId?: string;
  trigger: EmailCampaign['trigger'];
  triggerConfig?: EmailCampaign['triggerConfig'];
  scheduledFor?: Date;
}
```

**What it does:**
- Campaign name input
- Template selector (dropdown)
- Segment selector (dropdown, optional)
- Trigger type selector
- Conditional trigger config based on type
- Schedule date/time picker (if trigger=scheduled)
- Preview button
- Send test email button
- Submit button

---

### 9.7 Reward Components

#### RewardBuilder
**Purpose:** Create/edit rewards

**Props:**
```typescript
interface RewardBuilderProps {
  campaignId: string;
  initialData?: Partial<Reward>;
  onSubmit: (data: CreateRewardRequest) => Promise<void>;
}

interface CreateRewardRequest {
  name: string;
  description: string;
  type: Reward['type'];
  value?: string;
  tier: number;
  triggerType: Reward['triggerType'];
  triggerValue?: number;
  inventory?: number;
  expiryDate?: Date;
  deliveryMethod: Reward['deliveryMethod'];
}
```

**What it does:**
- Form with all reward fields
- Type selector (dropdown)
- Trigger type selector
- Conditional trigger value input
- Tier number input (1-10)
- Inventory input (optional)
- Expiry date picker (optional)
- Delivery method selector
- Preview card
- Save button

#### RewardTiers
**Purpose:** Display reward tiers

**Props:**
```typescript
interface RewardTiersProps {
  campaignId: string;
  currentUserProgress?: {
    referralCount: number;
    nextTierTarget: number;
  };
}
```

**What it does:**
- Fetches rewards sorted by tier
- Display as vertical timeline
- Each tier shows: icon, name, requirement
- Progress bar if currentUserProgress provided
- Unlocked tiers have checkmark
- Current tier highlighted
- Next tier shows "X more to go"

---

### 9.8 Team Components

#### TeamMembers
**Purpose:** Team member list

**Props:**
```typescript
interface TeamMembersProps {
  onInvite?: () => void;
}
```

**What it does:**
- Fetches team members
- Table: Avatar, Name, Email, Role, Last Active, Actions
- Invite button (opens modal)
- Change role dropdown (per member)
- Remove member button
- Owner cannot be removed
- Show pending invitations separately

#### TeamInviteModal
**Purpose:** Invite new member

**Props:**
```typescript
interface TeamInviteModalProps {
  onInvite: (data: { email: string; role: string }) => Promise<void>;
  onClose: () => void;
}
```

**What it does:**
- Email input
- Role selector (dropdown)
- Send invite button
- Close button
- Validates email
- Shows success message

---

### 9.9 Integration Components

#### IntegrationList
**Purpose:** Available integrations

**Props:**
```typescript
interface IntegrationListProps {
  onConnect?: (integrationId: string) => void;
}
```

**What it does:**
- Grid of integration cards
- Each card: Logo, Name, Description, Status
- Connect button (if disconnected)
- Configure button (if connected)
- Disconnect button (if connected)
- Filter by category: Email, CRM, Analytics, Webhook

#### WebhookManager
**Purpose:** Manage webhooks

**Props:**
```typescript
interface WebhookManagerProps {
  campaignId: string;
}
```

**What it does:**
- List webhooks
- Create webhook button
- Each webhook row: Name, URL, Events, Status, Actions
- Test button (sends test payload)
- View logs button (opens modal with delivery logs)
- Edit/Delete buttons

---

## 10. Routing Structure

### Route Tree

```
/ (Dashboard)
/campaigns (Campaign list)
/campaigns/new (Create campaign wizard)
/campaigns/:id (Campaign overview)
/campaigns/:id/form-builder (Form builder)
/campaigns/:id/users (User list)
/campaigns/:id/analytics (Analytics)
/campaigns/:id/emails (Email campaigns)
/campaigns/:id/referrals (Referral settings)
/campaigns/:id/rewards (Rewards)
/campaigns/:id/integrations (Integrations)
/campaigns/:id/settings (Settings)

/analytics (Global analytics)

/team (Team management)

/integrations (Integration marketplace)

/settings (Account settings)
/settings/billing (Billing)
/settings/security (Security, 2FA)

/auth/login
/auth/signup
/auth/verify/:token

/w/:referralCode (Public waitlist signup)
```

### Protected Routes

All routes except `/auth/*` and `/w/*` require authentication.

---

## 11. Development Phases

### Phase 1: Foundation (Month 1)

**Week 1-2: Setup & Auth**
- [ ] Project setup (Vite + React + TypeScript + TanStack Router)
- [ ] Install dependencies
- [ ] Create directory structure
- [ ] Implement cache (`lib/cache.ts`)
- [ ] Create contexts (AppContext, AuthContext)
- [ ] Auth components (LoginForm, SignupForm)
- [ ] Protected route wrapper
- [ ] Base layouts (AppLayout, AuthLayout)

**Week 3-4: Campaign Management**
- [ ] Campaign types
- [ ] Campaign service
- [ ] Campaign hooks (useCampaigns, useCreateCampaign, useUpdateCampaign)
- [ ] CampaignCard component
- [ ] CampaignForm component
- [ ] CampaignList component
- [ ] CampaignStats component
- [ ] Campaign routes
- [ ] Campaign detail page

### Phase 2: Viral Mechanics (Month 2)

**Week 1-2: Referral System**
- [ ] Referral types
- [ ] Referral service
- [ ] Referral hooks
- [ ] ReferralDashboard component
- [ ] ReferralLink component
- [ ] ShareButtons component
- [ ] LeaderboardWidget component
- [ ] PositionTracker component
- [ ] Polling hook (usePolling)
- [ ] Confetti component (canvas)

**Week 3-4: Form Builder**
- [ ] Form types (FormConfig, FormField, etc.)
- [ ] FormBuilder component
- [ ] FieldPalette component
- [ ] FormCanvas component (HTML5 drag-drop)
- [ ] FormPreview component
- [ ] FormStyleEditor component
- [ ] Public waitlist form widget (separate build)
- [ ] Form service
- [ ] Form hooks

### Phase 3: Email & Analytics (Month 3)

**Week 1-2: Email System**
- [ ] Email types
- [ ] Email service
- [ ] Email hooks
- [ ] EmailTemplateList component
- [ ] EmailEditor component (rich text)
- [ ] EmailCampaignForm component
- [ ] Email automation triggers

**Week 3-4: Analytics**
- [ ] Analytics types
- [ ] Analytics service
- [ ] Analytics hooks
- [ ] AnalyticsDashboard component
- [ ] GrowthChart component (Recharts)
- [ ] ConversionFunnel component (Recharts)
- [ ] TrafficSources component (Recharts)
- [ ] Date range selector
- [ ] Export functionality

### Phase 4: Additional Features (Month 4-6)

**Month 4:**
- [ ] Reward system (RewardBuilder, RewardTiers)
- [ ] User management (UserList, UserProfile, BulkActions, UserFilters)
- [ ] Advanced form features (conditional logic, multi-step)

**Month 5:**
- [ ] Team collaboration (TeamMembers, TeamInviteModal)
- [ ] Integration marketplace (IntegrationList, WebhookManager)
- [ ] Email A/B testing

**Month 6:**
- [ ] White-label branding
- [ ] Custom domains
- [ ] Advanced analytics (predictive, benchmarks)
- [ ] Mobile responsive optimization

---

## Implementation Notes

1. **Follow CLAUDE.md** - Use existing component patterns, styling conventions
2. **Type Everything** - Strict TypeScript, no `any`
3. **Suspense Boundaries** - Wrap data-fetching components
4. **Error Boundaries** - Catch errors, show user-friendly messages
5. **Loading States** - Skeletons matching component layout
6. **Empty States** - Helpful messages with CTAs
7. **Accessibility** - WCAG 2.1 AA compliance
8. **Responsive** - Mobile-first, test 320px to 4K
9. **Performance** - Virtual scroll for large lists, lazy load heavy components
10. **Testing** - Write tests alongside implementation

---

**END OF SPECIFICATION DOCUMENT**

This document specifies types, components, and architecture. Implementation follows patterns from CLAUDE.md.
