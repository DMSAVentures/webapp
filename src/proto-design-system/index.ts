// =============================================================================
// PROTO DESIGN SYSTEM - PUBLIC API
// =============================================================================

// Context Providers
export {
  ThemeProvider,
  type ThemeContextValue,
  type ThemeProviderProps,
} from "./context/ThemeProvider";
export {
  MotionProvider,
  useMotionContext,
  type MotionContextValue,
  type MotionProviderProps,
} from "./context/MotionProvider";

// Hooks
export { useTheme } from "./hooks/useTheme";
export { useReducedMotion } from "./hooks/useReducedMotion";
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from "./hooks/useMediaQuery";
export {
  useMotionConfig,
  useAnimationVariants,
  type MotionConfig,
  type SpringConfig,
  type SpringPreset,
} from "./hooks/useMotionConfig";
export { useClickOutside } from "./hooks/useClickOutside";
export { useFocusTrap } from "./hooks/useFocusTrap";

// Utilities
export { cn } from "./utils/cn";
export { getToken, setToken, removeToken, getTokens, tokenVar } from "./utils/tokens";
export {
  generateId,
  announce,
  isVisible,
  getFocusableElements,
  prefersReducedMotion,
  prefersDarkMode,
  prefersHighContrast,
  aria,
} from "./utils/a11y";

// Theme utilities
export {
  applyTheme,
  getCurrentTheme,
  getSystemTheme,
  subscribeToSystemTheme,
  themes,
  themeNames,
  type ThemeName,
  type Theme,
} from "./themes/themes";

// Components - Primitives
export {
  Button,
  ButtonGroup,
  Link,
  LinkButton,
  type ButtonProps,
  type ButtonGroupProps,
  type LinkProps,
  type LinkButtonProps,
  type ButtonVariant,
  type ButtonSize,
  type LinkVariant,
  type LinkSize,
} from "./components/primitives/Button";

export {
  Text,
  type TextProps,
  type TextElement,
  type TextSize,
  type TextWeight,
  type TextColor,
  type TextAlign,
} from "./components/primitives/Text";

export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
} from "./components/primitives/Badge";

export {
  Spinner,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
} from "./components/primitives/Spinner";

export {
  Avatar,
  type AvatarProps,
  type AvatarSize,
  type AvatarVariant,
} from "./components/primitives/Avatar";

export {
  Skeleton,
  type SkeletonProps,
  type SkeletonVariant,
} from "./components/primitives/Skeleton";

export {
  Icon,
  type IconProps,
  type IconSize,
  type IconColor,
} from "./components/primitives/Icon";

export {
  Input,
  type InputProps,
  type InputSize,
  type InputVariant,
} from "./components/forms/Input";

// Components - Forms
export * from "./components/forms";

// Components - Layout
export * from "./components/layout";

// Components - Feedback
export * from "./components/feedback";

// Components - Navigation
export * from "./components/navigation";

// Components - Data
export * from "./components/data";

// Components - Composite
export * from "./components/composite";

// Components - Overlays
export * from "./components/overlays";
