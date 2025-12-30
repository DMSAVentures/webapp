#!/bin/bash

# Script to convert old design tokens to new proto design system CSS custom properties

# Find all SCSS files with old design token imports
FILES=$(grep -r "@use \"@/design-tokens" src/features src/components --include="*.scss" -l 2>/dev/null)

for file in $FILES; do
  echo "Processing: $file"

  # Create temp file
  temp_file=$(mktemp)

  # Check if file uses responsive mixins
  needs_mixins=$(grep -E "@media.*breakpoints\.\$breakpoint" "$file" || true)

  # Process the file
  cat "$file" | \
    # Remove old @use imports
    grep -v '@use "@/design-tokens/' | \
    # Replace spacing tokens
    sed 's/layout\.\$spacing-01/var(--space-0-5)/g' | \
    sed 's/layout\.\$spacing-02/var(--space-1)/g' | \
    sed 's/layout\.\$spacing-03/var(--space-2)/g' | \
    sed 's/layout\.\$spacing-04/var(--space-3)/g' | \
    sed 's/layout\.\$spacing-05/var(--space-4)/g' | \
    sed 's/layout\.\$spacing-06/var(--space-5)/g' | \
    sed 's/layout\.\$spacing-07/var(--space-6)/g' | \
    sed 's/layout\.\$spacing-08/var(--space-8)/g' | \
    sed 's/layout\.\$spacing-09/var(--space-10)/g' | \
    sed 's/layout\.\$spacing-10/var(--space-12)/g' | \
    sed 's/layout\.\$spacing-11/var(--space-12)/g' | \
    sed 's/layout\.\$spacing-12/var(--space-14)/g' | \
    sed 's/layout\.\$spacing-13/var(--space-16)/g' | \
    # Replace typography tokens
    sed 's/typography\.\$font-size-xs/var(--font-size-xs)/g' | \
    sed 's/typography\.\$font-size-sm/var(--font-size-sm)/g' | \
    sed 's/typography\.\$font-size-md/var(--font-size-base)/g' | \
    sed 's/typography\.\$font-size-lg/var(--font-size-lg)/g' | \
    sed 's/typography\.\$font-size-xl/var(--font-size-xl)/g' | \
    sed 's/typography\.\$font-size-h1/var(--font-size-4xl)/g' | \
    sed 's/typography\.\$font-size-h2/var(--font-size-2xl)/g' | \
    sed 's/typography\.\$font-size-h3/var(--font-size-xl)/g' | \
    sed 's/typography\.\$font-size-h4/var(--font-size-xl)/g' | \
    sed 's/typography\.\$font-size-h5/var(--font-size-lg)/g' | \
    sed 's/typography\.\$font-size-h6/var(--font-size-base)/g' | \
    sed 's/typography\.\$font-size-display/var(--font-size-5xl)/g' | \
    sed 's/typography\.\$font-weight-regular/var(--font-weight-normal)/g' | \
    sed 's/typography\.\$font-weight-medium/var(--font-weight-medium)/g' | \
    sed 's/typography\.\$font-weight-semibold/var(--font-weight-semibold)/g' | \
    sed 's/typography\.\$font-weight-bold/var(--font-weight-bold)/g' | \
    sed 's/typography\.\$line-height-none/var(--line-height-none)/g' | \
    sed 's/typography\.\$line-height-tight/var(--line-height-tight)/g' | \
    sed 's/typography\.\$line-height-normal/var(--line-height-normal)/g' | \
    sed 's/typography\.\$line-height-relaxed/var(--line-height-relaxed)/g' | \
    sed 's/typography\.\$font-family-mono/var(--font-family-mono)/g' | \
    # Replace border tokens
    sed 's/border\.\$border-width-small/1px/g' | \
    sed 's/border\.\$border-width-medium/2px/g' | \
    sed 's/border\.\$border-radius-small/var(--radius-sm)/g' | \
    sed 's/border\.\$border-radius-medium/var(--radius-md)/g' | \
    sed 's/border\.\$border-radius-large/var(--radius-lg)/g' | \
    sed 's/border\.\$border-radius-round/var(--radius-full)/g' | \
    # Replace motion tokens
    sed 's/motion\.\$duration-fast-01/var(--duration-fast)/g' | \
    sed 's/motion\.\$duration-moderate-01/var(--duration-normal)/g' | \
    sed 's/motion\.\$duration-slow-01/var(--duration-slow)/g' | \
    sed 's/motion\.\$easing-productive-standard/var(--ease-out)/g' | \
    sed 's/motion\.\$easing-expressive-standard/var(--ease-out)/g' | \
    # Replace color tokens
    sed 's/var(--color-surface-primary-default)/var(--color-surface)/g' | \
    sed 's/var(--color-surface-secondary-default)/var(--color-base-100)/g' | \
    sed 's/var(--color-surface-input-default)/var(--color-base-200)/g' | \
    sed 's/var(--color-border-primary-default)/var(--color-border)/g' | \
    sed 's/var(--color-border-secondary-default)/var(--color-border)/g' | \
    sed 's/var(--color-border-primary-hover)/var(--color-border-hover)/g' | \
    sed 's/var(--color-text-primary-default)/var(--color-base-content)/g' | \
    sed 's/var(--color-text-secondary-default)/var(--color-base-content-secondary)/g' | \
    sed 's/var(--color-text-tertiary-default)/var(--color-base-content-tertiary)/g' | \
    sed 's/var(--color-icon-primary-default)/var(--color-base-content)/g' | \
    sed 's/var(--color-icon-secondary-default)/var(--color-base-content-secondary)/g' | \
    sed 's/var(--color-icon-tertiary-default)/var(--color-base-content-tertiary)/g' | \
    sed 's/var(--color-bg-secondary-default)/var(--color-base-100)/g' | \
    sed 's/var(--color-bg-secondary-hover)/var(--color-base-200)/g' | \
    sed 's/var(--color-bg-tertiary-default)/var(--color-base-200)/g' | \
    sed 's/var(--color-bg-info-default)/oklch(from var(--color-info) l c h \/ 0.15)/g' | \
    sed 's/var(--color-bg-info-alpha)/oklch(from var(--color-info) l c h \/ 0.15)/g' | \
    sed 's/var(--color-bg-danger-alpha)/oklch(from var(--color-error) l c h \/ 0.15)/g' | \
    sed 's/var(--color-text-info-default)/var(--color-info)/g' | \
    sed 's/var(--color-info-default)/var(--color-info)/g' | \
    sed 's/var(--color-success-default)/var(--color-success)/g' | \
    sed 's/var(--color-error-default)/var(--color-error)/g' | \
    sed 's/var(--color-warning-default)/var(--color-warning)/g' | \
    sed 's/var(--color-text-success-default)/var(--color-success)/g' | \
    sed 's/var(--color-text-warning-default)/var(--color-warning)/g' | \
    sed 's/var(--color-error-text)/var(--color-error)/g' | \
    # Replace breakpoint media queries with mixins
    sed 's/@media (max-width: breakpoints\.\$breakpoint-sm)/@include breakpoint-down(sm)/g' | \
    sed 's/@media (max-width: breakpoints\.\$breakpoint-md)/@include breakpoint-down(md)/g' | \
    sed 's/@media (max-width: breakpoints\.\$breakpoint-lg)/@include breakpoint-down(lg)/g' | \
    sed 's/@media (width <= 768px)/@include breakpoint-down(md)/g' | \
    sed 's/@media (width <= 1024px)/@include breakpoint-down(lg)/g' \
    > "$temp_file"

  # If file uses responsive mixins, add the import at the top
  if [ -n "$needs_mixins" ] || grep -q "@include breakpoint" "$temp_file"; then
    # Check if import already exists
    if ! grep -q '@use "@/proto-design-system/mixins"' "$temp_file"; then
      # Add import after the comment header (look for first empty line after comments)
      sed -i '' '1s/^/@use "@\/proto-design-system\/mixins" as *;\n/' "$temp_file" 2>/dev/null || \
      sed -i '1s/^/@use "@\/proto-design-system\/mixins" as *;\n/' "$temp_file"
    fi
  fi

  # Replace original file
  mv "$temp_file" "$file"
done

echo "Migration complete!"
