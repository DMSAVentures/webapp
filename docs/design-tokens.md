# Design Tokens Reference

## Overview
Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values to maintain a scalable and consistent visual system.

## Import Pattern

**Always use `@use` syntax, never `@import`:**

```scss
@use "@/design-tokens/layout" as layout;
@use "@/design-tokens/typography" as typography;
@use "@/design-tokens/motion" as motion;
@use "@/design-tokens/border" as border;
@use "@/design-tokens/breakpoints" as breakpoints;
// Only import colors for multi-color components (Badge, Banner, etc.)
// @use "@/design-tokens/colors" as colors;
```

## Typography Tokens

### Font Sizes

**Text Sizes:**
- `$font-size-xs` = 11px - Tiny text, footnotes
- `$font-size-sm` = 12px - Small text, captions
- `$font-size-md` = 13px - Body text, default (base size)
- `$font-size-lg` = 14px - Large body text
- `$font-size-xl` = 16px - Subheadings

**Heading Sizes:**
- `$font-size-h6` = 20px
- `$font-size-h5` = 22px
- `$font-size-h4` = 24px
- `$font-size-h3` = 28px
- `$font-size-h2` = 32px
- `$font-size-h1` = 40px

**❌ INVALID (DO NOT USE):**
- `$font-size-2xl`, `$font-size-3xl`, `$font-size-4xl`, `$font-size-5xl` - These do NOT exist

### Font Weights

**Available Weights:**
- `$font-weight-light` = 400
- `$font-weight-regular` = 500 (default - can be omitted)
- `$font-weight-medium` = 600
- `$font-weight-semibold` = 700
- `$font-weight-bold` = 800

**❌ INVALID:** `$font-weight-normal` (does NOT exist - use `$font-weight-regular`)

**⚠️ NOTE:** Since `regular` (500) is the default font weight, you can omit `font-weight` declarations for regular weight text.

### Line Heights

- `$line-height-none` = 1
- `$line-height-tight` = 1.25
- `$line-height-snug` = 1.375
- `$line-height-normal` = 1.5
- `$line-height-relaxed` = 1.625
- `$line-height-loose` = 2

### Letter Spacing

- `$letter-spacing-tighter` = -0.05em
- `$letter-spacing-tight` = -0.025em
- `$letter-spacing-normal` = 0
- `$letter-spacing-wide` = 0.025em
- `$letter-spacing-wider` = 0.05em

### Font Families

- `$font-family-sans` = "Geist", system-ui, -apple-system, ...
- `$font-family-serif` = serif
- `$font-family-mono` = monospace

## Layout Tokens

### Spacing (8px base unit system)

- `$spacing-01` = 2px
- `$spacing-02` = 4px
- `$spacing-03` = 8px
- `$spacing-04` = 12px
- `$spacing-05` = 20px
- `$spacing-06` = 24px
- `$spacing-07` = 32px
- `$spacing-08` = 40px
- `$spacing-09` = 48px
- `$spacing-10` = 56px
- `$spacing-11` = 64px
- `$spacing-12` = 72px
- `$spacing-13` = 80px

**Usage:**
```scss
padding: layout.$spacing-03 layout.$spacing-05;  // 8px 20px
margin-bottom: layout.$spacing-04;                // 12px
gap: layout.$spacing-03;                           // 8px
```

**❌ DON'T:** Use arbitrary values like `10px`, `25px`, `15px`

## Border Tokens

### Border Widths

- `$border-width-small` = 1px (Used in interactive states)
- `$border-width-medium` = 2px (Used in most components)
- `$border-width-large` = 4px (Used in large components like cards, modals)

### Border Radius

- `$border-radius-small` = 4px (For small components like buttons)
- `$border-radius-medium` = 8px (For cards, inputs, etc.)
- `$border-radius-large` = 12px
- `$border-radius-round` = 999px (For fully rounded elements)

**❌ INVALID:** `$border-radius-full` (does NOT exist - use `$border-radius-round`)

## Motion Tokens

### Durations

- `$duration-fast-01` = 70ms
- `$duration-fast-02` = 110ms
- `$duration-moderate-01` = 150ms
- `$duration-moderate-02` = 240ms
- `$duration-slow-01` = 400ms
- `$duration-slow-02` = 700ms

### Easings

- `$easing-productive-standard` = cubic-bezier(0.2, 0, 0.38, 0.9)
- `$easing-productive-entrance` = cubic-bezier(0, 0, 0.38, 0.9)
- `$easing-productive-exit` = cubic-bezier(0.2, 0, 1, 0.9)
- `$easing-expressive-standard` = cubic-bezier(0.4, 0.14, 0.3, 1)
- `$easing-expressive-entrance` = cubic-bezier(0, 0, 0.3, 1)
- `$easing-expressive-exit` = cubic-bezier(0.4, 0.14, 1, 1)

**Usage:**
```scss
transition: background-color motion.$duration-moderate-01 motion.$easing-productive-standard;
animation: slideIn motion.$duration-slow-01 motion.$easing-expressive-standard;
```

**❌ DON'T:** Use arbitrary timing like `200ms`, `0.3s ease-in-out`

## Breakpoint Tokens

- `$breakpoint-sm` = 320px (Small mobile)
- `$breakpoint-md` = 672px (Tablet)
- `$breakpoint-lg` = 1056px (Desktop)
- `$breakpoint-xlg` = 1312px (Large desktop)
- `$breakpoint-max` = 1584px (Extra large desktop)

**Usage:**
```scss
@media (max-width: breakpoints.$breakpoint-md) {
  // Tablet and below styles
}

@media (min-width: breakpoints.$breakpoint-lg) {
  // Desktop and above styles
}
```

**❌ NEVER use hardcoded pixel values:** 767px, 768px, 1024px, etc.

## Color Tokens

### CSS Custom Properties (Theme Variables)

**Most components should use CSS custom properties from `theme.scss`:**

#### Backgrounds (Interactive Elements)
- `--color-bg-primary-default`, `--color-bg-primary-hover`, `--color-bg-primary-active`
- `--color-bg-secondary-default`, `--color-bg-secondary-hover`, `--color-bg-secondary-active`
- `--color-bg-tertiary-default`
- `--color-bg-primary-disabled`, `--color-bg-secondary-disabled`

#### Surfaces (Containers)
- `--color-surface-primary-default`
- `--color-surface-secondary-default`

#### Borders
- `--color-border-primary-default`, `--color-border-primary-hover`
- `--color-border-secondary-default`
- `--color-border-focus-default`
- `--color-border-disabled-default`

#### Text
- `--color-text-primary-default`
- `--color-text-secondary-default`
- `--color-text-tertiary-default`
- `--color-text-inverse-default`
- `--color-text-disabled-default`

#### Icons
- `--color-icon-primary-default`
- `--color-icon-secondary-default`
- `--color-icon-disabled-default`

#### Semantic States
- `--color-error-default`, `--color-error-text`
- `--color-success-default`, `--color-text-success-default`
- `--color-warning-default`, `--color-text-warning-default`
- `--color-info-default`, `--color-text-info-default`

#### Semantic Backgrounds
- `--color-bg-danger-default`, `--color-bg-danger-hover`
- `--color-bg-success-default`, `--color-bg-success-hover`
- `--color-bg-warning-default`, `--color-bg-warning-hover`
- `--color-bg-info-default`, `--color-bg-info-hover`

#### Alpha Backgrounds
- `--color-bg-info-alpha`
- `--color-bg-success-alpha`
- `--color-bg-warning-alpha`
- `--color-bg-danger-alpha`

#### Semantic Borders
- `--color-border-danger-default`
- `--color-border-success-default`
- `--color-border-warning-default`
- `--color-border-info-default`

#### Utilities
- `--color-white`
- `--color-focus-ring-default`
- `--color-shadow-default`
- `--color-shadow-elevated`
- `--color-alpha-focus`
- `--color-alpha-shadow`

### SCSS Color Variables

**Only use for multi-color components (Badge, Banner, StatusBadge, LinkButton, Tag):**

```scss
@use "@/design-tokens/colors" as colors;

// Color scales (50-900 for each color)
colors.$color-blue-50, colors.$color-blue-100, ..., colors.$color-blue-900
colors.$color-green-50, colors.$color-green-100, ..., colors.$color-green-900
colors.$color-red-50, colors.$color-red-100, ..., colors.$color-red-900
colors.$color-yellow-50, colors.$color-yellow-100, ..., colors.$color-yellow-900
colors.$color-purple-50, colors.$color-purple-100, ..., colors.$color-purple-900
colors.$color-orange-50, colors.$color-orange-100, ..., colors.$color-orange-900
colors.$color-neutral-50, colors.$color-neutral-100, ..., colors.$color-neutral-900

// Special colors
colors.$color-white
colors.$color-black
```

### Color Usage Examples

```scss
// ✅ CORRECT: Use CSS custom properties for most components
.container {
  background-color: var(--color-bg-primary-default);
  color: var(--color-text-primary-default);
  border: 1px solid var(--color-border-primary-default);
  box-shadow: 0 layout.$spacing-01 layout.$spacing-03 var(--color-shadow-default);

  &:hover {
    background-color: var(--color-bg-primary-hover);
  }
}

// ✅ CORRECT: Use SCSS colors for multi-color components
@use "@/design-tokens/colors" as colors;

.badge_blue {
  background-color: colors.$color-blue-500;
  color: colors.$color-white;
}

// ❌ WRONG: Don't hardcode colors
.container {
  background-color: #1a1a1a;
  color: rgb(255, 255, 255);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

## Common Patterns

### Responsive Typography
```scss
.heading {
  font-size: typography.$font-size-h3;  // 28px

  @media (max-width: breakpoints.$breakpoint-md) {
    font-size: typography.$font-size-h4;  // 24px
  }
}
```

### Dynamic Sizing with calc()
```scss
.container {
  width: calc(layout.$spacing-13 * 3.75);  // 300px (80px * 3.75)
  height: calc(layout.$spacing-10 * 2);    // 80px (40px * 2)
}
```

### Hover States with Semantic Progression
```scss
.button {
  background-color: var(--color-bg-primary-default);
  transition: background-color motion.$duration-fast-01 motion.$easing-productive-standard;

  &:hover {
    background-color: var(--color-bg-primary-hover);
  }

  &:active {
    background-color: var(--color-bg-primary-active);
  }

  &:focus-visible {
    outline: border.$border-width-medium solid var(--color-focus-ring-default);
    outline-offset: layout.$spacing-01;
  }
}
```

## Visual Hierarchy & Design Style

### Flat Design Approach

Our design system uses a **flat design style** that relies on surface colors, padding, and typography to create visual hierarchy — rather than borders and shadows.

**Core Principles:**

1. **Surface Colors for Separation** - Use `--color-surface-secondary-default` to differentiate content sections from the page background
2. **Typography for Hierarchy** - Use font size and weight variations to establish importance
3. **Spacing for Grouping** - Use consistent padding and gaps to group related content
4. **Minimal Borders** - Avoid visible borders; use surface color contrast instead
5. **No Decorative Shadows** - Reserve shadows only for elevated elements (modals, dropdowns)

### Card & Section Pattern

- Use surface color backgrounds instead of borders or shadows
- Apply medium border radius for rounded corners
- On hover, transition to a slightly different surface color (`--color-surface-input-default`)

### Title Outside, Content Inside Pattern

When designing sections with titles:
- Keep section titles on the page background (white)
- Wrap content in a surface-colored container
- This creates clear visual separation between the title and its content

### Typography Hierarchy

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| Page title | `$font-size-h2` | semibold | primary |
| Section title | `$font-size-h4` | semibold | primary |
| Subsection title | `$font-size-xl` | semibold | primary |
| Body text | `$font-size-md` | regular | primary |
| Labels | `$font-size-sm` | medium | secondary |
| Captions | `$font-size-xs` | regular | tertiary |

### Interactive Cards

- Use surface color as default background
- Transition to a different surface color on hover
- Include focus-visible outline for accessibility
- Use motion tokens for smooth transitions

### Icon Styling

- Display icons with adequate padding, without background shapes
- Use semantic colors for status variants (success, warning, error)
- Size icons appropriately using heading font sizes

## Quick Reference

```scss
// Typography
font-size: typography.$font-size-md;           // 13px
font-weight: typography.$font-weight-semibold; // 700
line-height: typography.$line-height-normal;   // 1.5
letter-spacing: typography.$letter-spacing-wide; // 0.025em

// Layout
padding: layout.$spacing-04;                   // 12px
margin: layout.$spacing-05;                    // 20px
gap: layout.$spacing-03;                       // 8px

// Borders
border: border.$border-width-medium solid var(--color-border-primary-default);
border-radius: border.$border-radius-medium;   // 8px

// Motion
transition: all motion.$duration-moderate-01 motion.$easing-productive-standard;

// Breakpoints
@media (max-width: breakpoints.$breakpoint-md) { /* styles */ }
```
