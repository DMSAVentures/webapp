# Technical Design Document Template
## [Project Name]

**Version:** 1.0
**Last Updated:** [Date]
**Target:** AI Agent Implementation
**Stack:** [Tech Stack]

> **Purpose:** This document specifies data types, component requirements, and architectural decisions. Implementation follows existing patterns from CLAUDE.md.

---

## Template Guidelines

### What to Include
✅ **TypeScript type definitions** - All data structures
✅ **Component specifications** - Props + "What it does" descriptions
✅ **Architectural decisions** - Technology choices with rationale
✅ **Minimal dependencies** - Only what's absolutely necessary
✅ **Clear strategies** - How to handle state, data, forms, etc.
✅ **Development phases** - Step-by-step implementation plan

### What NOT to Include
❌ **Code implementations** - No actual code, just specifications
❌ **Duplicate patterns** - Reference CLAUDE.md instead of repeating
❌ **Library overhead** - Prefer vanilla/built-in solutions
❌ **Detailed tutorials** - Assume familiarity with existing patterns

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dependencies](#2-dependencies)
3. [Type Definitions](#3-type-definitions)
4. [Application Structure](#4-application-structure)
5. [State Management Strategy](#5-state-management-strategy)
6. [Data Fetching Strategy](#6-data-fetching-strategy)
7. [Form Handling Strategy](#7-form-handling-strategy)
8. [Real-Time Updates Strategy](#8-real-time-updates-strategy) *(if applicable)*
9. [Component Specifications](#9-component-specifications)
10. [Routing Structure](#10-routing-structure)
11. [Development Phases](#11-development-phases)

---

## 1. Architecture Overview

### Core Principles
- **[Principle 1]** - [Description]
- **[Principle 2]** - [Description]
- **Follow CLAUDE.md** - Use existing component patterns, styling conventions
- **Type-safe** - Full TypeScript coverage with strict mode

### Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| State Management | [Choice] | [Why] |
| Data Fetching | [Choice] | [Why] |
| Form Handling | [Choice] | [Why] |
| Real-Time | [Choice] | [Why] |
| Styling | SCSS Modules + BEM | Existing pattern from CLAUDE.md |
| Components | Follow CLAUDE.md patterns | Consistency |
| Routing | [Choice] | [Why] |
| Charts/Viz | [Choice] | [Why] |

### Technology Philosophy

**Prefer Vanilla/Built-in:**
- Use React 19 features: `use()`, `useOptimistic()`, `useActionState()`, `Suspense`
- Use native browser APIs: Clipboard API, Drag & Drop API, Canvas, WebSocket
- Avoid external libraries unless complexity justifies it

**Only Add Dependencies When:**
- Building from scratch would take weeks (e.g., charts, date utilities)
- Library is industry standard and well-maintained
- Bundle size impact is acceptable (<50KB)

---

## 2. Dependencies

**Final Dependencies:**
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "[essential-lib-1]": "^x.x.x",
    "[essential-lib-2]": "^x.x.x"
  }
}
```

**NOT Using:**
- ❌ [State library] - Use React Context + useReducer
- ❌ [Form library] - Use React 19 useActionState
- ❌ [Validation library] - Custom validation functions
- ❌ [Animation library] - Use CSS + Web Animations API
- ❌ [Any other rejected libraries]

**Rationale:**
- Minimal bundle size
- Full control over implementation
- Deep understanding of React 19
- Easier debugging and maintenance

---

## 3. Type Definitions

### Core Types

```typescript
// types/common.types.ts

// === Main Domain Types ===

export interface [MainEntity1] {
  id: string;
  // ... all fields with types
  createdAt: Date;
  updatedAt: Date;
}

export interface [MainEntity2] {
  id: string;
  // ... all fields with types
  createdAt: Date;
}

// === Configuration Types ===

export interface [ConfigType1] {
  // ... configuration fields
}

// === Nested/Related Types ===

export interface [RelatedType1] {
  // ... related entity fields
}

// === API Response Types ===

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

// === Pagination ===

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

// === UI State Types ===

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// === Filter/Search Types ===

export interface [EntityFilters] {
  // ... filter fields
}
```

**Instructions for Type Definitions:**
1. Define ALL domain entities
2. Include complete field definitions with types
3. Use TypeScript utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`
4. Define request/response types separately
5. Document complex types with JSDoc comments

---

## 4. Application Structure

```
src/
├── features/                      # Feature modules
│   ├── [feature-1]/
│   │   ├── components/
│   │   │   ├── [Component1]/
│   │   │   ├── [Component2]/
│   │   │   └── [Component3]/
│   │   ├── hooks/
│   │   │   ├── use[Feature].ts
│   │   │   ├── useCreate[Feature].ts
│   │   │   └── useUpdate[Feature].ts
│   │   └── types/
│   │       └── [feature].types.ts
│   │
│   ├── [feature-2]/
│   └── [feature-3]/
│
├── proto-design-system/           # Existing (keep as-is)
│
├── contexts/                      # Global contexts
│   ├── AppContext.tsx             # App-level state
│   └── [FeatureContext].tsx       # Feature-specific global state
│
├── hooks/                         # Shared hooks
│   ├── fetcher.ts                 # Existing HTTP client
│   ├── useFetch.ts                # Data fetching with Suspense
│   ├── usePolling.ts              # Real-time polling (if needed)
│   └── useDebounce.ts             # Input debouncing
│
├── lib/                           # Core utilities
│   ├── cache.ts                   # In-memory data cache
│   └── validation.ts              # Form validation utilities
│
├── services/                      # API services
│   ├── [entity1].service.ts
│   ├── [entity2].service.ts
│   └── [entity3].service.ts
│
├── types/                         # TypeScript types
│   ├── common.types.ts            # Core types (from section 3)
│   └── api.types.ts               # API-specific types
│
├── utils/                         # Utilities
│   ├── date.utils.ts
│   ├── number.utils.ts
│   └── [domain].utils.ts
│
├── routes/                        # TanStack Router routes
│   ├── __root.tsx
│   ├── index.tsx
│   └── [feature]/
│       └── [subroutes]/
│
└── design-tokens/                 # Existing (keep as-is)
```

**Structure Guidelines:**
- Group by feature, not by technical layer
- Each feature is self-contained with components, hooks, types
- Shared utilities in root-level directories
- Keep design system separate and untouched

---

## 5. State Management Strategy

### Philosophy: Use React Built-ins Only

**Component State (useState, useReducer):**
- Local UI state (modals, accordions, selections)
- Form inputs and validation states
- Component-specific loading/error states

**Global State (Context + useReducer):**
```typescript
// contexts/AppContext.tsx
interface AppState {
  [globalState1]: type;
  [globalState2]: type;
  // ... minimal global state only
}

// Split contexts by concern - don't create one giant context
```

**Server Data (Suspense + Cache):**
- Fetch with existing `fetcher` from CLAUDE.md
- Cache in `lib/cache.ts` (simple Map-based cache)
- Use `<Suspense>` boundaries for loading states
- Use React 19's `use()` hook to read promises

**Optimistic Updates (useOptimistic):**
- Use `useOptimistic()` for instant UI feedback
- Automatically reverts on error

### Data Caching

**Cache Implementation:**
- Simple Map in `lib/cache.ts`
- Key format: `"entity:action:params"`
- 5-minute stale time (configurable)
- Manual invalidation on mutations

**Cache Key Examples:**
```
"[entity]:list"
"[entity]:list:{"filter":"value"}"
"[entity]:{id}"
"[nested]:[parentId]:[childId]"
```

---

## 6. Data Fetching Strategy

### Pattern

1. **Service Layer** - API calls using existing `fetcher`
2. **Cache Layer** - Simple Map in `lib/cache.ts`
3. **Hook Layer** - Custom hooks that check cache, then fetch
4. **Component Layer** - Wrap in `<Suspense>` for loading

### Service Example
```typescript
// services/[entity].service.ts
import { fetcher } from '@/hooks/fetcher';

const API_BASE = import.meta.env.VITE_API_URL;

export const [entity]Service = {
  list: (params?: [ParamType]) =>
    fetcher<[EntityType][]>(`${API_BASE}/api/[entities]`, params),

  get: (id: string) =>
    fetcher<[EntityType]>(`${API_BASE}/api/[entities]/${id}`),

  create: (data: Create[Entity]Request) =>
    fetcher<[EntityType]>(`${API_BASE}/api/[entities]`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<[EntityType]>) =>
    fetcher<[EntityType]>(`${API_BASE}/api/[entities]/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetcher<void>(`${API_BASE}/api/[entities]/${id}`, {
      method: 'DELETE',
    }),
};
```

### Hook Pattern
```typescript
// features/[feature]/hooks/use[Entities].ts

// GET - Fetch with Suspense
export function use[Entities](filters?: [FilterType]) {
  // Suspends while loading
  // Returns data directly
}

// POST/PUT/DELETE - Mutations with useTransition
export function useCreate[Entity]() {
  const [isPending, startTransition] = useTransition();

  const mutate = async (data: Create[Entity]Request) => {
    // Mutation logic
    // Invalidate cache
    // Show toast
  };

  return { mutate, isPending };
}
```

---

## 7. Form Handling Strategy

### Use React 19 Actions

**No validation libraries (no Zod, no Yup).** Manual validation with `useActionState`.

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

// Add domain-specific validators
export function validate[DomainField](value: any): string | null {
  // Custom validation logic
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
  // Handle validation
  // Return: values, errors, touched, isPending, submitAction
}
```

---

## 8. Real-Time Updates Strategy

### Decision: [Polling / WebSocket / Server-Sent Events]

**Phase 1 Approach:** [Simple polling / No real-time]

**Polling Hook (if applicable):**
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
- [Feature 1] - every [interval]
- [Feature 2] - every [interval]
- [Feature 3] - every [interval]

**Future Enhancement:** [WebSocket implementation plan for Phase 2]

---

## 9. Component Specifications

### 9.1 [Feature 1] Components

#### [ComponentName]
**Purpose:** [What this component does]

**Props:**
```typescript
interface [ComponentName]Props {
  [prop1]: type;
  [prop2]?: type; // Optional
  [eventHandler]?: (data: type) => void;
}
```

**What it does:**
- [Behavior 1]
- [Behavior 2]
- [User interaction 1]
- [User interaction 2]
- Uses [DesignSystemComponent] from proto-design-system
- [Visual/styling notes]

**States:**
- Loading: [What shows]
- Error: [What shows]
- Empty: [What shows]
- Success: [What shows]

---

### 9.2 [Feature 2] Components

#### [ComponentName]
**Purpose:** [What this component does]

**Props:**
```typescript
interface [ComponentName]Props {
  // ... props
}
```

**What it does:**
- [Detailed behavior description]

---

## 10. Routing Structure

### Route Tree

```
/ ([Description])
/[route1] ([Description])
/[route1]/[subroute1] ([Description])
/[route1]/[subroute2] ([Description])
/[route1]/:id ([Description])
/[route1]/:id/[action] ([Description])

/[route2] ([Description])
/[route2]/:id ([Description])

/[route3] ([Description])

/settings ([Description])
/settings/[subsetting1] ([Description])
/settings/[subsetting2] ([Description])

/auth/login
/auth/signup
/auth/verify/:token
```

### Protected Routes

[Describe which routes require authentication]

### Route Parameters

```typescript
// Route params types
interface [Feature]RouteParams {
  id: string;
  [otherParam]?: string;
}
```

---

## 11. Development Phases

### Phase 1: Foundation (Month 1)

**Week 1-2: Setup & [Core Feature]**
- [ ] Project setup (Vite + React + TypeScript + TanStack Router)
- [ ] Install dependencies
- [ ] Create directory structure
- [ ] Implement cache (`lib/cache.ts`)
- [ ] Create contexts ([Context1], [Context2])
- [ ] [Core feature] components
- [ ] Protected route wrapper
- [ ] Base layouts

**Week 3-4: [Primary Feature]**
- [ ] [Entity] types
- [ ] [Entity] service
- [ ] [Entity] hooks
- [ ] [Component1] component
- [ ] [Component2] component
- [ ] [Component3] component
- [ ] [Entity] routes
- [ ] [Entity] detail page

### Phase 2: [Major Feature] (Month 2)

**Week 1-2: [Subfeature 1]**
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

**Week 3-4: [Subfeature 2]**
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Phase 3: [Enhancement Feature] (Month 3)

**Week 1-2: [Subfeature 1]**
- [ ] [Task 1]
- [ ] [Task 2]

**Week 3-4: [Subfeature 2]**
- [ ] [Task 1]
- [ ] [Task 2]

### Phase 4: Additional Features (Month 4-6)

**Month 4:**
- [ ] [Feature set 1]

**Month 5:**
- [ ] [Feature set 2]

**Month 6:**
- [ ] [Feature set 3]
- [ ] Performance optimization
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

## Appendix: Decision Log

Track major decisions and their rationale:

| Decision | Options Considered | Chosen | Rationale | Date |
|----------|-------------------|--------|-----------|------|
| [Decision 1] | A, B, C | A | [Why A] | [Date] |
| [Decision 2] | X, Y | X | [Why X] | [Date] |

---

**END OF SPECIFICATION DOCUMENT**

This document specifies types, components, and architecture. Implementation follows patterns from CLAUDE.md.

---

## Template Usage Instructions

### How to Use This Template

1. **Copy this template** for each new PRD
2. **Fill in the brackets** with project-specific information
3. **Add all TypeScript types** in Section 3
4. **Specify every component** with props and descriptions in Section 9
5. **Define all routes** in Section 10
6. **Break down phases** with specific tasks in Section 11
7. **Remove sections** that don't apply (e.g., real-time if not needed)
8. **Add sections** if needed for project-specific concerns

### Quality Checklist

Before considering the tech design complete:

- [ ] All domain entities have TypeScript definitions
- [ ] All components have props interfaces
- [ ] All components have "What it does" descriptions
- [ ] Architectural decisions table is complete with rationale
- [ ] Dependencies list includes ONLY essential libraries
- [ ] State management strategy is clearly defined
- [ ] Form handling approach is specified
- [ ] Routing structure is complete
- [ ] Development phases have concrete tasks
- [ ] Document references CLAUDE.md instead of duplicating patterns

### Anti-Patterns to Avoid

❌ Don't write actual code implementations
❌ Don't include step-by-step tutorials
❌ Don't duplicate existing patterns from CLAUDE.md
❌ Don't add dependencies without strong justification
❌ Don't skip TypeScript type definitions
❌ Don't leave component specifications vague

### Good Practices

✅ TypeScript types first, always
✅ Component specs include props + behavior
✅ Prefer vanilla/built-in over libraries
✅ Clear decision rationale in tables
✅ Reference existing patterns
✅ Concrete, actionable task lists
