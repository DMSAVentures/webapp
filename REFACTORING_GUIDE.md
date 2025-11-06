# Component Refactoring Guide: Proto Design System Compliance

## Objective
Ensure all feature components properly use the proto design system instead of custom implementations, following CLAUDE.md guidelines.

## Step-by-Step Process

### 1. Initial Analysis
**Identify components that need refactoring:**
```bash
# Find all component files
find src/features -name "*.tsx" -type f | grep -v stories

# Search for custom HTML elements
grep -rn "<input\|<select\|<textarea\|<button" src/features --include="*.tsx"

# Search for custom badges or UI elements
grep -rn "className.*badge\|className.*button" src/features --include="*.tsx"
```

### 2. Component-by-Component Refactoring

#### A. Replace Custom Form Inputs

**Custom Input → TextInput**
```tsx
// ❌ BEFORE
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter value"
  className={styles.input}
/>

// ✅ AFTER
import { TextInput } from '@/proto-design-system/TextInput/textInput';

<TextInput
  label="Field Label"
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter value"
  hint="Optional helper text"
  error={error}
/>
```

**Custom Select → Dropdown**
```tsx
// ❌ BEFORE
<select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="opt1">Option 1</option>
  <option value="opt2">Option 2</option>
</select>

// ✅ AFTER
import Dropdown from '@/proto-design-system/dropdown/dropdown';

<Dropdown
  label="Select Option"
  placeholderText="Choose an option"
  size="medium"
  options={[
    { value: 'opt1', label: 'Option 1', description: 'Description' },
    { value: 'opt2', label: 'Option 2', description: 'Description' }
  ]}
  onChange={(option) => setValue(option.value)}
/>
```

**Custom Textarea → TextArea**
```tsx
// ❌ BEFORE
<textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={4}
/>

// ✅ AFTER
import { TextArea } from '@/proto-design-system/TextArea/textArea';

<TextArea
  label="Description"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={4}
  maxLength={500}
  error={error}
/>
```

#### B. Replace Custom UI Elements

**Custom Checkbox → CheckboxWithLabel**
```tsx
// ❌ BEFORE
<label>
  <input type="checkbox" checked={checked} onChange={handleChange} />
  Label Text
</label>

// ✅ AFTER
import CheckboxWithLabel from '@/proto-design-system/checkbox/checkboxWithLabel';

<CheckboxWithLabel
  text="Label Text"
  description=""
  checked={checked ? "checked" : "unchecked"}
  onChange={handleChange}
  flipCheckboxToRight={false}
/>
```

**Custom Badge Divs → Badge Component**
```tsx
// ❌ BEFORE
<div className={styles.badge}>
  <i className="ri-icon" />
  Badge Text
</div>

// ✅ AFTER
import { Badge } from '@/proto-design-system/badge/badge';

<Badge
  text="Badge Text"
  variant="blue"
  styleType="light"
  size="small"
  iconClass="icon-name"
  iconPosition="left"
/>
```

**Custom Progress Bar → ProgressBar**
```tsx
// ❌ BEFORE
<div className={styles.progressBar}>
  <div className={styles.progressFill} style={{ width: `${percent}%` }} />
</div>

// ✅ AFTER
import ProgressBar from '@/proto-design-system/progressbar/progressbar';

<ProgressBar
  progress={percent}
  variant="info"
  size="medium"
  showPercentage={false}
/>
```

**Custom Modal → Modal**
```tsx
// ❌ BEFORE
{isOpen && (
  <div className={styles.modal}>
    <div className={styles.content}>
      {children}
    </div>
  </div>
)}

// ✅ AFTER
import Modal from '@/proto-design-system/modal/modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  description="Optional description"
  dismissibleByCloseIcon={true}
  proceedText="Confirm"
  cancelText="Cancel"
  onProceed={handleProceed}
  onCancel={handleCancel}
>
  {/* Modal content */}
</Modal>
```

#### C. Fix Import Casing Issues
```bash
# Find case-sensitive import mismatches
npm run build 2>&1 | grep -i "differs from already included file name"
```

**Common fixes:**
```tsx
// ❌ WRONG CASING
import Modal from '@/proto-design-system/Modal/modal';
import Checkbox from '@/proto-design-system/Checkbox/Checkbox';
import ProgressBar from '@/proto-design-system/ProgressBar/progressBar';

// ✅ CORRECT CASING
import Modal from '@/proto-design-system/modal/modal';
import Checkbox from '@/proto-design-system/checkbox/checkbox';
import ProgressBar from '@/proto-design-system/progressbar/progressbar';
```

#### D. Fix API Mismatches

**Common API issues to fix:**
1. **TextInput**: Use `hint` not `helperText`
2. **Checkbox**: Use `"checked" | "unchecked"` not `boolean`
3. **Modal**: Use `isOpen` not `open`, requires `title` and `proceedText`
4. **ProgressBar**: Accepts only `"success" | "warning" | "error" | "info"`
5. **Dropdown**: Requires `DropdownOptionInput[]` with `value`, `label`, `description`

### 3. SCSS Refactoring

#### A. Remove Custom Component Styles
```scss
// ❌ DELETE custom input/button/badge styles
.customInput {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  // ... 50+ lines of custom styles
}
```

#### B. Replace Hardcoded Values with Design Tokens

**Search for hardcoded values:**
```bash
grep -rn "^\s*[^/].*:\s*[0-9]" src/features --include="*.scss" | \
  grep -v "layout\.\|typography\.\|border\.\|motion\.\|colors\.\|--color"
```

**Font Sizes:**
```scss
// ❌ BEFORE
font-size: 48px;
font-size: 14px;

// ✅ AFTER
@use "@/design-tokens/typography" as typography;
font-size: typography.$font-size-h1;  // 40px
font-size: typography.$font-size-lg;  // 14px
```

**Spacing/Layout:**
```scss
// ❌ BEFORE
width: 40px;
height: 40px;
padding: 12px 16px;
margin: 20px;
gap: 8px;

// ✅ AFTER
@use "@/design-tokens/layout" as layout;
width: layout.$spacing-10;      // 40px
height: layout.$spacing-10;     // 40px
padding: layout.$spacing-04 layout.$spacing-05;  // 12px 16px
margin: layout.$spacing-05;     // 20px
gap: layout.$spacing-03;        // 8px
```

**Borders:**
```scss
// ❌ BEFORE
border: 2px solid #ccc;
border-radius: 8px;

// ✅ AFTER
@use "@/design-tokens/border" as border;
border: border.$border-width-medium solid var(--color-border-primary-default);
border-radius: border.$border-radius-small;
```

**Colors:**
```scss
// ❌ BEFORE
background-color: #1a1a1a;
color: #ffffff;
border: 1px solid rgba(0, 0, 0, 0.1);

// ✅ AFTER
background-color: var(--color-bg-primary-default);
color: var(--color-text-primary-default);
border: 1px solid var(--color-border-primary-default);
box-shadow: 0 4px 8px var(--color-shadow-default);
```

**Animations:**
```scss
// ❌ BEFORE
transition: all 200ms ease-in-out;

// ✅ AFTER
@use "@/design-tokens/motion" as motion;
transition: background-color motion.$duration-moderate-01 motion.$easing-productive-standard;
```

**Breakpoints:**
```scss
// ❌ BEFORE
@media (max-width: 768px) {
  // styles
}

// ✅ AFTER
@use "@/design-tokens/breakpoints" as breakpoints;
@media (max-width: breakpoints.$breakpoint-md) {
  // styles
}
```

#### C. Use Calculated Values for Centering
```scss
// ❌ BEFORE - Fixed offset, won't align if icon size changes
.connector {
  left: 20px;
}

// ✅ AFTER - Dynamic centering based on icon width
.connector {
  left: calc(layout.$spacing-08 / 2);  // Centers on 32px icon
}
```

### 4. Design Token Reference

**Import tokens in SCSS:**
```scss
@use "@/design-tokens/layout" as layout;
@use "@/design-tokens/typography" as typography;
@use "@/design-tokens/motion" as motion;
@use "@/design-tokens/border" as border;
@use "@/design-tokens/breakpoints" as breakpoints;
// Only import colors for multi-color components (Badge, Banner, etc.)
```

**Available Tokens:**

**Spacing (8px base):**
- `$spacing-01` (2px) to `$spacing-13` (80px)

**Typography:**
- Text: `$font-size-xs` (11px) to `$font-size-xl` (16px)
- Headings: `$font-size-h6` (20px) to `$font-size-h1` (40px)
- Weights: `$font-weight-light` to `$font-weight-bold`

**Colors:**
Use CSS custom properties from `theme.scss`:
- Backgrounds: `--color-bg-primary-default`, `--color-bg-primary-hover`
- Surfaces: `--color-surface-primary-default`
- Text: `--color-text-primary-default`, `--color-text-secondary-default`
- Borders: `--color-border-primary-default`
- Icons: `--color-icon-primary-default`
- Semantic: `--color-success-default`, `--color-error-default`, etc.

**Borders:**
- Widths: `$border-width-small`, `$border-width-medium`
- Radii: `$border-radius-small`, `$border-radius-medium`, `$border-radius-large`

**Motion:**
- Durations: `$duration-fast-01`, `$duration-moderate-01`, `$duration-slow-01`
- Easings: `$easing-productive-standard`, `$easing-expressive-standard`

**Breakpoints:**
- `$breakpoint-sm` (320px)
- `$breakpoint-md` (672px)
- `$breakpoint-lg` (1056px)
- `$breakpoint-xlg` (1312px)
- `$breakpoint-max` (1584px)

### 5. Verification Steps

#### A. Build Check
```bash
# Check for TypeScript errors
npm run build

# Look for specific error types:
# - Import casing issues
# - Missing required props
# - Incorrect prop types
npm run build 2>&1 | grep "error TS"
```

#### B. Common Build Errors & Fixes

**Error: "Property 'helperText' does not exist"**
```tsx
// Fix: Use 'hint' instead
hint="Helper text here"
```

**Error: "Type 'boolean' is not assignable to type '"checked" | "unchecked"'"**
```tsx
// Fix: Convert boolean to string
checked={isChecked ? "checked" : "unchecked"}
```

**Error: "Property 'title' is missing in type"**
```tsx
// Fix: Add required Modal props
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"  // Required
  proceedText="OK"     // Required
>
```

**Error: "differs from already included file name...only in casing"**
```tsx
// Fix: Use correct lowercase casing
import Modal from '@/proto-design-system/modal/modal';
```

#### C. Visual Verification in Storybook
```bash
# Start Storybook to visually verify components
npm run storybook
```

### 6. Component Sizing Guidelines

**Appropriate Sizes for Common Elements:**

**Icons in Timeline/Stepper:**
- Desktop: 32px (spacing-08)
- Mobile: 24px (spacing-06)
- Font size: md (13px) to lg (14px)

**Buttons:**
Use proto design system Button component sizes:
- small, medium, large

**Badges:**
- Size: "small" or "medium"
- Most common: small

**Form Inputs:**
Use TextInput/Dropdown default sizing

**Modal Widths:**
- Small: 400px
- Medium: 600px
- Large: 800px

### 7. Final Checklist

Before committing, verify:

- [ ] No custom `<input>`, `<select>`, `<textarea>`, `<button>` elements
- [ ] All form inputs use proto design system components
- [ ] No custom badge/status divs - use Badge component
- [ ] All imports use correct casing (lowercase folder names)
- [ ] No hardcoded pixel values in SCSS
- [ ] All spacing uses `layout.$spacing-*`
- [ ] All typography uses `typography.$font-size-*`
- [ ] All colors use `var(--color-*)`
- [ ] All borders use `border.$border-*`
- [ ] All animations use `motion.$duration-*` and `motion.$easing-*`
- [ ] All breakpoints use `breakpoints.$breakpoint-*`
- [ ] `npm run build` succeeds with no errors
- [ ] Components look correct in Storybook
- [ ] Responsive behavior works on mobile

### 8. Commit Message Template

```
refactor: replace custom [component type] with proto design system

[Brief description of what was changed]

## Changes Made:

### Component Refactoring:
- Replaced custom [element] with [ProtoComponent]
  - [Details of the change]

### SCSS Cleanup:
- Removed ~XX lines of custom styles
- Replaced hardcoded values with design tokens:
  - [specific changes]

### Import/API Fixes:
- Fixed [specific issues]

## Results:
✅ Build succeeds with no errors
✅ All components use proto design system
✅ All values use design tokens
✅ [Other benefits]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 9. Reference Examples

**Well-Refactored Components:**
- `src/features/rewards/components/RewardBuilder/component.tsx`
- `src/features/rewards/components/RewardTiers/component.tsx`
- `src/features/users/components/UserFilters/component.tsx`
- `src/features/users/components/UserProfile/component.tsx`

These components demonstrate:
- Proper use of proto design system
- 100% design token compliance
- Clean, maintainable code
- No custom implementations

---

## Quick Reference Commands

```bash
# Find components needing refactoring
find src/features -name "*.tsx" | xargs grep -l "<input\|<select\|<textarea"

# Find hardcoded CSS values
grep -rn ":\s*[0-9].*px" src/features --include="*.scss" | grep -v "layout\.\|typography\."

# Check build
npm run build 2>&1 | grep "error"

# Visual check
npm run storybook

# Verify all changes
git status
git diff

# Commit
git add .
git commit -m "refactor: [description]"
```

---

## Summary

This refactoring process ensures:
1. **Consistency** - All components use the same design system
2. **Maintainability** - Easy to update styles globally via design tokens
3. **Quality** - Professional, production-ready components
4. **Compliance** - Follows CLAUDE.md guidelines exactly
5. **Accessibility** - Proto design system components include proper ARIA attributes

By following this guide, you can systematically refactor any feature component to be fully compliant with the proto design system and design token standards.
