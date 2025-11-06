# Proto Design System Components

## Overview
The proto design system provides 28+ pre-built, accessible components. **ALWAYS check if a proto component exists before creating custom implementations.**

## Component Categories

### Forms
- TextInput
- TextArea
- Dropdown
- Checkbox
- CheckboxWithLabel
- Toggle
- RadioButton
- FileUpload

### Buttons
- Button (with leftIcon support)
- IconOnlyButton
- LinkButton

### Feedback
- Badge
- StatusBadge
- Banner
- Toast
- ProgressBar
- Spinner

### Layout
- Card
- ContentDivider
- Modal
- Sheet
- Accordion

### Navigation
- DropdownMenu
- Tabs
- Breadcrumbs

## Component APIs

### Button Component

**Import:**
```tsx
import { Button } from '@/proto-design-system/Button/button';
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `leftIcon`: string (icon name without 'ri-' prefix)
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

**✅ CORRECT Usage:**
```tsx
// Button with icon
<Button variant="secondary" size="medium" leftIcon="arrow-right">
  Next
</Button>

// Primary button
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// Disabled button
<Button variant="tertiary" disabled>
  Unavailable
</Button>
```

**❌ WRONG Usage:**
```tsx
// Don't manually render icons
<Button variant="secondary">
  <i className="ri-arrow-right" />
  Next
</Button>

// Don't apply custom className to override styles
<Button className={styles.customButton} variant="secondary">
  Click me
</Button>
```

**Note:** Button adds the 'ri-' prefix automatically to icons, so pass icon names like `"arrow-right"`, not `"ri-arrow-right"`.

---

### TextInput Component

**Import:**
```tsx
import { TextInput } from '@/proto-design-system/TextInput/textInput';
```

**Props:**
- `label`: string (required)
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time'
- `value`: string
- `onChange`: (e: ChangeEvent<HTMLInputElement>) => void
- `placeholder`: string
- `hint`: string (helper text below input)
- `error`: string (error message)
- `disabled`: boolean
- `required`: boolean
- `leftIcon`: string
- `showLeftIcon`: boolean

**✅ CORRECT Usage:**
```tsx
<TextInput
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  hint="We'll never share your email"
  error={emailError}
  required
/>

// With icon
<TextInput
  label="Search"
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  leftIcon="ri-search-line"
  showLeftIcon={true}
/>
```

**❌ WRONG Usage:**
```tsx
// Don't use helperText (use hint)
<TextInput helperText="Helper text here" />

// Don't create custom input styling
<input className={styles.customInput} />
```

---

### TextArea Component

**Import:**
```tsx
import { TextArea } from '@/proto-design-system/TextArea/textArea';
```

**Props:**
- `label`: string (required)
- `value`: string
- `onChange`: (e: ChangeEvent<HTMLTextAreaElement>) => void
- `placeholder`: string
- `rows`: number (default: 4)
- `maxLength`: number
- `error`: string
- `disabled`: boolean
- `required`: boolean

**✅ CORRECT Usage:**
```tsx
<TextArea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={6}
  maxLength={500}
  placeholder="Enter description..."
  error={descError}
/>
```

---

### Dropdown Component

**Import:**
```tsx
import Dropdown from '@/proto-design-system/dropdown/dropdown';
```

**Props:**
- `label`: string
- `options`: DropdownOptionInput[] (requires value, label, description)
- `placeholderText`: string
- `size`: 'small' | 'medium' | 'large'
- `onChange`: (option: DropdownOptionInput) => void
- `disabled`: boolean

**Option Structure:**
```tsx
interface DropdownOptionInput {
  value: string;
  label: string;
  description?: string;
  selected?: boolean;
}
```

**✅ CORRECT Usage:**
```tsx
const statusOptions: DropdownOptionInput[] = [
  { value: 'active', label: 'Active', description: 'User is active' },
  { value: 'inactive', label: 'Inactive', description: 'User is inactive' },
  { value: 'pending', label: 'Pending', description: 'Awaiting approval' },
];

<Dropdown
  label="Status"
  options={statusOptions}
  placeholderText="Select status"
  size="medium"
  onChange={(option) => setStatus(option.value)}
/>
```

**❌ WRONG Usage:**
```tsx
// Don't use custom <select> elements
<select value={status} onChange={handleChange}>
  <option value="active">Active</option>
</select>
```

---

### CheckboxWithLabel Component

**Import:**
```tsx
import CheckboxWithLabel from '@/proto-design-system/checkbox/checkboxWithLabel';
```

**Props:**
- `text`: string (label text)
- `description`: string
- `checked`: 'checked' | 'unchecked' (NOT boolean!)
- `onChange`: () => void
- `flipCheckboxToRight`: boolean
- `disabled`: boolean

**✅ CORRECT Usage:**
```tsx
<CheckboxWithLabel
  text="I agree to the terms and conditions"
  description="You must agree to continue"
  checked={isAgreed ? "checked" : "unchecked"}
  onChange={() => setIsAgreed(!isAgreed)}
  flipCheckboxToRight={false}
/>
```

**❌ WRONG Usage:**
```tsx
// Don't use boolean for checked
<CheckboxWithLabel checked={isChecked} />

// Don't create custom checkbox
<label>
  <input type="checkbox" checked={isChecked} />
  Label
</label>
```

---

### Badge Component

**Import:**
```tsx
import { Badge } from '@/proto-design-system/badge/badge';
```

**Props:**
- `text`: string (required)
- `variant`: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
- `styleType`: 'light' | 'dark'
- `size`: 'small' | 'medium'
- `iconClass`: string (icon name)
- `iconPosition`: 'left' | 'right'
- `dismissible`: boolean
- `onDismiss`: () => void

**✅ CORRECT Usage:**
```tsx
<Badge
  text="Active"
  variant="green"
  styleType="light"
  size="small"
/>

<Badge
  text="Tier 1"
  variant="blue"
  styleType="light"
  size="small"
  iconClass="trophy-fill"
  iconPosition="left"
/>
```

**❌ WRONG Usage:**
```tsx
// Don't create custom badge divs
<div className={styles.badge}>
  <i className="ri-icon" />
  Badge Text
</div>
```

---

### ProgressBar Component

**Import:**
```tsx
import ProgressBar from '@/proto-design-system/progressbar/progressbar';
```

**Props:**
- `progress`: number (0-100, required)
- `size`: 'small' | 'medium' | 'large'
- `variant`: 'success' | 'warning' | 'error' | 'info'
- `showPercentage`: boolean

**✅ CORRECT Usage:**
```tsx
<ProgressBar
  progress={75}
  size="medium"
  variant="info"
  showPercentage={true}
/>
```

**❌ WRONG Usage:**
```tsx
// Don't use percentage prop (use progress)
<ProgressBar percentage={75} />

// Don't use showLabel (use showPercentage)
<ProgressBar progress={75} showLabel={true} />

// Don't use invalid variants
<ProgressBar progress={75} variant="primary" />  // invalid - use 'info', 'success', etc.
```

---

### Modal Component

**Import:**
```tsx
import Modal from '@/proto-design-system/modal/modal';
```

**Props:**
- `isOpen`: boolean (required, NOT 'open')
- `onClose`: () => void (required)
- `title`: string (required)
- `description`: string
- `proceedText`: string (required)
- `cancelText`: string
- `onProceed`: () => void
- `onCancel`: () => void
- `dismissibleByCloseIcon`: boolean
- `centeredHeader`: boolean
- `children`: ReactNode

**✅ CORRECT Usage:**
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Confirm Delete"
  description="Are you sure you want to delete this item?"
  proceedText="Delete"
  cancelText="Cancel"
  onProceed={handleDelete}
  onCancel={handleClose}
  dismissibleByCloseIcon={true}
>
  <p>This action cannot be undone.</p>
</Modal>
```

**❌ WRONG Usage:**
```tsx
// Don't use 'open' prop (use 'isOpen')
<Modal open={isOpen} />

// Don't omit required props
<Modal isOpen={isOpen} onClose={handleClose}>
  Content
</Modal>  // Missing title and proceedText

// Don't create custom modal wrapper
{isOpen && (
  <div className={styles.modal}>
    <div className={styles.content}>...</div>
  </div>
)}
```

---

### Card Component

**Import:**
```tsx
import { Card } from '@/proto-design-system/card/card';
```

**Props:**
- `variant`: 'default' | 'outlined' | 'elevated'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `children`: ReactNode

**✅ CORRECT Usage:**
```tsx
<Card variant="elevated" padding="medium">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

---

## Import Casing Rules

**CRITICAL:** Import paths are case-sensitive on Linux/production servers!

**✅ CORRECT Casing:**
```tsx
import { Button } from '@/proto-design-system/Button/button';
import Modal from '@/proto-design-system/modal/modal';
import ProgressBar from '@/proto-design-system/progressbar/progressbar';
import { Badge } from '@/proto-design-system/badge/badge';
import CheckboxWithLabel from '@/proto-design-system/checkbox/checkboxWithLabel';
import Dropdown from '@/proto-design-system/dropdown/dropdown';
import { TextInput } from '@/proto-design-system/TextInput/textInput';
import { TextArea } from '@/proto-design-system/TextArea/textArea';
```

**❌ WRONG Casing (Will fail on Linux):**
```tsx
import { Button } from '@/proto-design-system/button/button';  // Wrong: 'button' should be 'Button'
import Modal from '@/proto-design-system/Modal/modal';          // Wrong: 'Modal' should be 'modal'
import ProgressBar from '@/proto-design-system/ProgressBar/progressbar';  // Wrong
```

**Rule of Thumb:** Check the actual folder name in `src/proto-design-system/` and match the casing exactly.

---

## General Guidelines

### DO's ✅
- Always check if a proto component exists before creating custom ones
- Use proto components with their proper prop names and types
- Let proto components handle their own styling and behavior
- Use the component's built-in features (leftIcon for Button, hint for TextInput, etc.)
- Keep layout/positioning styles separate from component styling

### DON'Ts ❌
- Never create custom implementations of form inputs, buttons, badges, etc.
- Never manually render icons inside Button (use leftIcon prop)
- Never apply custom className to override proto component styles
- Never use incorrect prop names (helperText, percentage, open, etc.)
- Never hardcode colors, spacing, or other values that should use design tokens

### When to Create Custom Components
Only create custom components when:
1. No similar proto component exists
2. The component is feature-specific (e.g., CampaignCard, UserProfileCard)
3. The component combines multiple proto components in a unique way

Even then, use proto components as building blocks!
