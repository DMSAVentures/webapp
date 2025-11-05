# React Design System Development Guidelines

## Project Overview
This is a **Vite-based React application** with TypeScript, featuring a comprehensive design system and modern development stack. The project uses a component-based architecture with a well-structured design token system.

## Technology Stack
- **Build Tool**: Vite 6.3.0 with React plugin
- **React**: Version 19.0.0
- **Routing**: TanStack Router with auto code-splitting
- **Styling**: SCSS with CSS Modules and BEM naming conventions
- **UI Icons**: RemixIcon library
- **Documentation**: Storybook 8.6.12
- **Payment**: Stripe integration
- **Type Safety**: TypeScript in strict mode

## Commands
- `npm run dev` - Start development server
- `npm run build` - TypeScript compilation + Vite build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built application
- `npm run storybook` - Run Storybook (port 6006)
- `npm run build-storybook` - Build static Storybook

## Project Structure

### Directory Organization
```
src/
├── proto-design-system/  # Design system components (28+ components)
├── components/
│   ├── authentication/   # Auth-related components
│   ├── ai/              # AI features
│   ├── billing/         # Payment/subscription components
│   └── [feature]/       # Feature-specific components
├── design-tokens/       # Design tokens and global styles
├── hooks/               # Custom React hooks (15+ hooks)
├── contexts/            # React contexts for state management
├── routes/              # TanStack Router route definitions
└── types/               # TypeScript type definitions
```

### Component File Structure
Every component follows this consistent pattern:
```
ComponentName/
├── component.tsx          # Main component with TypeScript interfaces
├── component.module.scss  # CSS Modules with BEM naming
├── component.stories.ts   # Storybook stories (co-located)
└── variations.tsx         # Component variations (if needed)
```

## Design System Usage

### Design Tokens
**Always use design tokens from `@/design-tokens/` instead of hardcoded values**

#### Import Pattern
```scss
@import "@/design-tokens/variables.scss";
```

#### Available Token Categories
- **Colors**: HSL-based with 10-step scales (50-900) plus alpha variants
- **Typography**: Purpose-based sizing (xs, sm, md, lg, xl, etc.)
- **Spacing**: 8px base unit system with 13 steps ($spacing-01 to $spacing-13)
- **Motion**: Easing curves and duration tokens
- **Borders**: Consistent border radii
- **Shadows**: Elevation system
- **Breakpoints**: Responsive design breakpoints

#### Color Token Usage
```scss
// ✅ DO: Use semantic color variables
background-color: var(--color-bg-primary-default);
color: var(--color-text-primary-default);
border: 1px solid var(--color-border-primary-default);

// ❌ DON'T: Use hardcoded values
background-color: #1a1a1a;
color: rgb(255, 255, 255);
```

#### Spacing Token Usage
```scss
// ✅ DO: Use spacing tokens
padding: $spacing-03 $spacing-05;  // 8px 20px
margin-bottom: $spacing-04;        // 12px
gap: $spacing-03;                   // 8px

// ❌ DON'T: Use arbitrary values
padding: 10px 25px;
margin-bottom: 15px;
```

#### Motion Token Usage
```scss
// ✅ DO: Use motion tokens for animations
transition: background-color $duration-moderate-01 $easing-productive-standard;
animation: slideIn $duration-slow-01 $easing-expressive-standard;

// ❌ DON'T: Use arbitrary timing
transition: background-color 200ms ease-in-out;
```

### Theming System
The application uses CSS custom properties for runtime theme switching:
```scss
// Theme variables are defined in theme.scss
--color-bg-primary-default: #{$color-neutral-900};
--color-bg-primary-hover: #{$color-neutral-800};
--color-text-primary-default: #{$color-neutral-800};
--color-border-primary-default: #{$color-neutral-300};
--color-focus-ring-default: #{$color-blue-400};
```

## Component Development

### TypeScript Patterns
All components must be typed with proper interfaces and JSDoc documentation:

```tsx
export interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
    /** Visual variant of the component */
    variant?: 'primary' | 'secondary' | 'tertiary';
    /** Size of the component */
    size?: 'small' | 'medium' | 'large';
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Additional CSS class name */
    className?: string;
}
```

### Component Implementation Pattern
Use functional components with hooks, forwardRef for DOM access, and memo for optimization:

```tsx
import { memo, forwardRef } from 'react';
import styles from './component.module.scss';

export const Component = memo(forwardRef<HTMLDivElement, ComponentProps>(
    function Component({
        variant = 'primary',
        size = 'medium',
        disabled = false,
        className: customClassName,
        children,
        ...props
    }, ref) {
        // BEM-style class composition
        const classNames = [
            styles.root,
            variant !== 'primary' && styles[`variant_${variant}`],
            size !== 'medium' && styles[`size_${size}`],
            disabled && styles.disabled,
            customClassName
        ].filter(Boolean).join(' ');
        
        return (
            <div ref={ref} className={classNames} {...props}>
                {children}
            </div>
        );
    }
));

Component.displayName = 'Component';
```

### Styling Patterns

#### CSS Module Structure
```scss
@import "@/design-tokens/variables.scss";

.root {
    // Base styles using design tokens
    display: flex;
    padding: $spacing-03;
    border-radius: $spacing-02;
    background-color: var(--color-bg-primary-default);
    color: var(--color-text-primary-default);
    transition: background-color $duration-moderate-01 $easing-productive-standard;
    
    // State modifiers
    &:hover {
        background-color: var(--color-bg-primary-hover);
    }
    
    &:focus-visible {
        outline: 2px solid var(--color-focus-ring-default);
        outline-offset: 2px;
    }
}

// BEM variant modifiers
.variant_secondary {
    background-color: var(--color-bg-secondary-default);
    color: var(--color-text-secondary-default);
}

.size_small {
    padding: $spacing-02 $spacing-03;
    font-size: $font-size-sm;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
```

### Icon Usage Pattern
Use RemixIcon consistently across all components:

```tsx
// Icon with proper accessibility
{leftIcon && (
    <i 
        className={`${styles.icon} ri-${leftIcon}`} 
        aria-hidden="true"  // Hide from screen readers
    />
)}
```

### Accessibility Requirements
All interactive components must include:
- Proper ARIA attributes
- Keyboard navigation support
- Focus-visible states
- Semantic HTML elements
- Screen reader considerations

```tsx
// Accessibility example
<button
    role="button"
    aria-label={ariaLabel}
    aria-pressed={isPressed}
    aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={handleKeyDown}
    {...props}
/>
```

## API Integration

### HTTP Client Configuration
Use the centralized `fetcher` utility for all API calls:

```typescript
import { fetcher } from '@/hooks/fetcher';

// Type-safe API call
const response = await fetcher<ResponseType>('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data)
});
```

### Custom Hook Patterns

#### Data Fetching Hooks (GET operations)
For data that should load on component mount:

```typescript
export const useGetData = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [data, setData] = useState<DataType | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const response = await fetcher<DataType>(
                `${import.meta.env.VITE_API_URL}/api/data`,
                { signal }
            );
            setData(response);
        } catch (error: any) {
            setError({ error: error.message });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
```

#### Operation Hooks (POST/PUT/DELETE)
For user-triggered operations:

```typescript
export const useCreateResource = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [data, setData] = useState<ResponseType | null>(null);

    const operation = useCallback(async (payload: RequestType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetcher<ResponseType>(
                `${import.meta.env.VITE_API_URL}/api/resource`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }
            );
            setData(response);
            return response;
        } catch (error: any) {
            setError({ error: error.message });
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { operation, loading, error, data };
};
```

#### Server-Sent Events (SSE)
For real-time streaming:

```typescript
const res = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
    },
    credentials: "include",  // Always include for cookie auth
    body: JSON.stringify(requestData),
});

const reader = res.body?.getReader();
const decoder = new TextDecoder("utf-8");
// Process stream...
```

### Authentication Pattern
Cookie-based authentication is used throughout:
- All API calls use `credentials: 'include'`
- No manual token management in localStorage
- Authentication state managed server-side

### Error Handling
Standardized error handling across all hooks:

```typescript
export interface ApiError {
    error: string;
}

// Component usage
if (error?.error === 'no active subscription found') {
    navigate({ to: '/billing/plans' });
}
```

### TypeScript API Types
Define all API types in `src/types/`:

```typescript
// src/types/billing.ts
export interface GetCurrentSubscriptionResponse {
    id: string;
    status: string;
    start_date: Date;
    end_date: Date;
    next_billing_date: Date;
}

// Date conversion in hooks
return {
    ...response,
    start_date: new Date(response.start_date),
    end_date: new Date(response.end_date),
    next_billing_date: new Date(response.next_billing_date)
};
```

## Stripe Integration
Use dedicated hooks for Stripe operations:

```typescript
// Checkout session
const { refetch, loading, error, clientSecret } = useCreateCheckoutSession({
    priceId: selectedPriceId
});

// Customer portal
const { operation: createPortal } = useCreateCustomerPortal();

// Subscription management
const { data: subscription } = useGetCurrentSubscription();
const { operation: cancelSubscription } = useCancelSubscription();
```

## Development Workflow

### Adding New Components
1. Create component directory in appropriate location:
   - Design system components → `src/proto-design-system/`
   - Feature components → `src/components/[feature]/`

2. Follow the standard file structure:
   ```
   ComponentName/
   ├── component.tsx
   ├── component.module.scss
   └── component.stories.ts
   ```

3. Implement with required patterns:
   - TypeScript interfaces with JSDoc
   - ForwardRef and memo wrappers
   - BEM-style CSS modules
   - Design token usage
   - Accessibility attributes

### Storybook Documentation
Every component must have a story file:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './component';

const meta = {
    title: 'ProtoDesignSystem/Component',
    component: Component,
    tags: ['autodocs'],  // Enable auto-documentation
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary']
        }
    }
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Default Component'
    }
};

export const AllVariants: Story = {
    render: () => (
        <>
            <Component variant="primary">Primary</Component>
            <Component variant="secondary">Secondary</Component>
            <Component variant="tertiary">Tertiary</Component>
        </>
    )
};
```

### Code Quality Standards

#### TypeScript Requirements
- Strict mode enabled
- All props must have interfaces
- Use proper generic types for hooks
- Avoid `any` type - use `unknown` or specific types

#### Import Organization
Follow this import order:
```typescript
// 1. React and core libraries
import { useState, useEffect, useCallback } from 'react';

// 2. Third-party libraries
import { useNavigate } from '@tanstack/react-router';

// 3. Internal utilities and hooks
import { fetcher } from '@/hooks/fetcher';

// 4. Types
import type { ComponentProps } from '@/types';

// 5. Components
import { Button } from '@/proto-design-system/Button';

// 6. Styles
import styles from './component.module.scss';
```

#### CSS/SCSS Guidelines
- Use CSS Modules for all component styles
- Follow BEM naming convention
- Always use design tokens
- Avoid `!important` except for critical overrides
- Use responsive mixins for breakpoints

### Performance Optimization
- Use `React.memo` for components that re-render frequently
- Implement `useCallback` and `useMemo` for expensive operations
- Use code splitting with TanStack Router
- Lazy load heavy components

### Testing Requirements
While no test files are currently present, when adding tests:
- Place test files alongside components
- Use `.test.tsx` or `.spec.tsx` extensions
- Test accessibility with testing-library
- Mock API calls in integration tests

## Best Practices

### DO's
- ✅ Use design tokens for all styling values
- ✅ Follow the established component patterns
- ✅ Include proper TypeScript types
- ✅ Add Storybook stories for new components
- ✅ Use semantic HTML elements
- ✅ Implement keyboard navigation
- ✅ Use the centralized fetcher for API calls
- ✅ Handle loading and error states consistently
- ✅ Use forwardRef for components that need DOM access
- ✅ Memoize components when appropriate

### DON'Ts
- ❌ Don't hardcode colors, spacing, or timing values
- ❌ Don't create new files unless absolutely necessary
- ❌ Don't use inline styles
- ❌ Don't ignore accessibility requirements
- ❌ Don't store tokens in localStorage
- ❌ Don't make direct fetch calls - use the fetcher utility
- ❌ Don't create documentation files unless requested
- ❌ Don't use arbitrary CSS values
- ❌ Don't skip TypeScript types
- ❌ Don't forget to handle error states

## Environment Variables
Required environment variables:
```env
VITE_API_URL=http://localhost:3000  # API base URL
```

## Common Patterns Reference

### Form Input with Error State
```tsx
<div className={styles['text-input']}>
    <label className={styles['text-input__label']}>
        {label}
        {required && <span className={styles['text-input__required']}>*</span>}
    </label>
    <div className={`${styles['text-input__input-container']} ${error ? styles['text-input__input-container--error'] : ''}`}>
        <input
            ref={ref}
            className={styles['text-input__input']}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
        />
    </div>
    {error && (
        <span id={`${id}-error`} className={styles['text-input__error-message']}>
            {error}
        </span>
    )}
</div>
```

### Loading State Pattern
```tsx
if (loading) {
    return <LoadingSpinner />;
}

if (error) {
    return <ErrorMessage error={error.error} />;
}

if (!data) {
    return <EmptyState />;
}

return <DataDisplay data={data} />;
```

### Responsive Typography Mixin
```scss
@include responsive-typography(
    $font-size-md,     // Mobile
    $font-size-lg,     // Tablet
    $font-size-xl,     // Desktop
    $line-height-body, // Line height
    $font-weight-normal // Font weight
);
```

This documentation represents the established patterns and conventions in your codebase. Follow these guidelines to maintain consistency and code quality across the application.
