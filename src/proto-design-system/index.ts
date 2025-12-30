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

