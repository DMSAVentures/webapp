# Next.js Project Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Run Storybook (port 6006)
- `npm run build-storybook` - Build static Storybook

## Code Style
- **TypeScript**: Strict mode enabled, use proper types for components and functions
- **Imports**: Use absolute imports with '@/' alias (e.g., `import Button from '@/components/Button'`)
- **Components**: Use functional components with React hooks, memoize with React.memo when appropriate
- **Props**: Define prop interfaces with proper JSDoc comments, use descriptive names
- **Styling**: Use CSS modules with BEM naming convention, SCSS for global styles
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for CSS files
- **Error Handling**: Use try/catch for async operations, provide meaningful error messages

## Architecture
- App Router pattern with (auth) and (webapp) groups
- Component stories in same directory as components
- Global styles in src/globalstyles, shared hooks in src/hooks
- Follow accessibility best practices (ARIA attributes, semantic HTML)