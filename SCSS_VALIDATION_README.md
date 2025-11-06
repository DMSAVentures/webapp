# SCSS Design Token Validation ✅ INSTALLED

## Quick Start

Validates that all SCSS properties use design tokens instead of hardcoded values.

### **Stylelint with Industry-Standard Plugins**

Already installed and configured!

```bash
# Run validation
npm run lint:scss

# Auto-fix issues (where possible)
npm run lint:scss:fix
```

**Installed Plugins:**
- ✅ `stylelint` - Core linter
- ✅ `stylelint-scss` - SCSS-specific rules
- ✅ `stylelint-declaration-strict-value` - Enforces design token usage (industry standard)
- ✅ `stylelint-config-standard-scss` - Standard SCSS conventions
- ✅ `stylelint-config-recess-order` - Property ordering

**Features:**
- ✅ Real-time validation in VS Code (with extension)
- ✅ Catches hardcoded values (colors, spacing, typography, etc.)
- ✅ Enforces design token usage
- ✅ Auto-fixes common issues
- ✅ Industry standard tooling

---

## What Gets Validated

The `stylelint-declaration-strict-value` plugin enforces that specific CSS properties use design tokens (SCSS variables) instead of hardcoded values:

```scss
// ❌ INVALID - Hardcoded values
.component {
  font-size: 16px;           // Should use typography.$font-size-lg
  color: #ff0000;            // Should use var(--color-error-default)
  padding: 20px;             // Should use layout.$spacing-05
  border-radius: 8px;        // Should use border.$border-radius-medium
}

// ✅ VALID - Using design tokens
.component {
  font-size: typography.$font-size-lg;
  color: var(--color-error-default);
  padding: layout.$spacing-05;
  border-radius: border.$border-radius-medium;
}

// ✅ ALSO VALID - Allowed keywords
.component {
  background-color: transparent;
  margin: 0;
  display: none;
  width: auto;
}
```

### Properties Being Validated

- **Colors**: Properties ending in `color`, plus `fill` and `stroke`
- **Typography**: `font-size`, `font-weight`, `line-height`, `letter-spacing`, `font-family`
- **Spacing**: `padding`, `margin`, `gap`
- **Borders**: `border-radius`, `border-width`
- **Animation**: `transition-duration`, `animation-duration`

### Allowed Values (Won't Trigger Errors)

- Keywords: `transparent`, `currentColor`, `inherit`, `initial`, `unset`, `none`, `auto`, `0`, `100%`
- Functions: `var()`, `calc()`, `url()`, `rgba()`, `rgb()`, `hsl()`, `hsla()`

---

## Current Status

**59 hardcoded values found** in the codebase that should use design tokens.

Run `npm run lint:scss` to see all violations.

---

## VS Code Setup (Optional but Recommended)

For real-time validation in your editor:

1. **Install Stylelint Extension**
   - Search for "Stylelint" in VS Code extensions
   - Install "Stylelint" by Stylelint

2. **Add to `.vscode/settings.json`:**
   ```json
   {
     "stylelint.enable": true,
     "stylelint.validate": ["css", "scss"],
     "editor.codeActionsOnSave": {
       "source.fixAll.stylelint": "explicit"
     },
     "css.validate": false,
     "scss.validate": false
   }
   ```

3. **Reload VS Code**

Now you'll see red squiggly lines under hardcoded values in real-time!

---

## How It Works

Uses **`stylelint-declaration-strict-value`** - an industry-standard plugin used by major design systems (Carbon, Kong, etc.) to enforce design token usage.

The plugin:
- Checks specific CSS properties for hardcoded values
- Allows SCSS variables (`$var`), CSS custom properties (`var(--name)`), and approved keywords
- Provides clear error messages pointing to the design token documentation
- Integrates seamlessly with existing stylelint workflows

---

## Documentation

- [docs/design-tokens.md](./docs/design-tokens.md) - Complete list of all available design tokens
- [docs/proto-components.md](./docs/proto-components.md) - Proto component APIs
- [Stylelint Documentation](https://stylelint.io/) - Official stylelint docs
- [stylelint-declaration-strict-value](https://github.com/AndyOGo/stylelint-declaration-strict-value) - Plugin documentation
