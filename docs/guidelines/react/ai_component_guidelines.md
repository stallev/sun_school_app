# Universal React Components Guidelines

This document provides comprehensive guidelines for creating React components that are framework-agnostic and can be used across different React-based frameworks (Next.js, Astro, Remix, etc.). These guidelines focus on universal React patterns and best practices.

---

## 1. 🏗️ Architectural Foundations

### 1.1. Component Hierarchy Principles
Components should follow a clear hierarchy based on complexity and reusability:

```
Pages/Views → Layouts → Organisms → Molecules → Atoms
```

| Level | Purpose | Characteristics | Examples |
|-------|---------|-----------------|----------|
| **Atoms** | Basic UI elements | Single responsibility, highly reusable | `Button`, `Input`, `Icon` |
| **Molecules** | Simple component groups | 2-3 atoms working together | `SearchField`, `UserAvatar` |
| **Organisms** | Complex UI sections | Multiple molecules/atoms | `Header`, `ProductCard`, `Form` |
| **Layouts** | Page structure | Containers and grid systems | `MainLayout`, `AuthLayout` |
| **Pages/Views** | Complete pages | Composition of organisms | `HomePage`, `UserProfile` |

### 1.2. Component Design Principles
- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Build complex components by combining simpler ones
- **Props Interface**: All components must have explicit TypeScript interfaces
- **Reusability**: Components should be designed for reuse across different contexts
- **Accessibility**: Components should follow WCAG guidelines
- **Explicit Typing**: Use explicit parameter typing `(props: PropsType)` instead of `React.FC<PropsType>` for better type inference and flexibility
- **Arrow Functions**: ⚠️ **MANDATORY REQUIREMENT**: All React components MUST be defined as arrow functions (`const ComponentName = (props: PropsType) => {...}`), NOT as regular functions (`function ComponentName() {...}`). This rule applies to all components: Server Components, Client Components, pages, layouts, and any other React components. Exception: Server Actions and utility functions may use regular functions.
- **SOLID Principles**: Components should follow SOLID principles:
  - **Single Responsibility Principle (SRP)**: Each component should have one clear responsibility and one reason to change
  - **Open/Closed Principle (OCP)**: Components should be open for extension through composition, but closed for modification
  - **Liskov Substitution Principle (LSP)**: Sub-components should be interchangeable without breaking parent component functionality
  - **Interface Segregation Principle (ISP)**: Props interfaces should be specific and not force components to implement unnecessary properties
  - **Dependency Inversion Principle (DIP)**: Components should depend on abstractions (interfaces, types), not on concrete implementations
- **Component Size Limit**: ⚠️ **MANDATORY REQUIREMENT**: Components must not exceed **100 lines of code** (code lines only, excluding comments and empty lines). If the limit is exceeded, **refactoring is required**.
- **Code Language**: ⚠️ **MANDATORY REQUIREMENT**: All code in this document (examples, code comments, variable names, function names, component names) must be exclusively in English.

### 1.3. Why Not React.FC?

We avoid using `React.FC<PropsType>` in favor of explicit parameter typing for several reasons:

1. **Better Type Inference**: Explicit typing provides better type inference and IntelliSense support
2. **Generic Support**: Works seamlessly with generic components, which `React.FC` struggles with
3. **Flexibility**: Allows explicit return type annotations when needed (e.g., `JSX.Element | null`)
4. **No Implicit Children**: In React 18+, `React.FC` no longer adds implicit `children`, but explicit typing is clearer
5. **Default Props**: Works better with default parameter values and `defaultProps`
6. **Modern Best Practice**: Aligns with current React and TypeScript community recommendations (2024-2025)

**Recommended Pattern:**
```typescript
interface ComponentProps {
  // props definition
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // component implementation
};
```

**Avoid:**
```typescript
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // component implementation
};
```

### 1.4. Component Size and Refactoring

#### 1.4.1. Component Size Limit

**⚠️ MANDATORY REQUIREMENT**: All React components must contain no more than **100 lines of code**.

**Code Language Requirement**: ⚠️ **MANDATORY REQUIREMENT**: All code in this document (examples, code comments, variable names, function names, component names) must be exclusively in English.

**How to count lines:**
- Count only code lines (TypeScript/JavaScript)
- **Exclude**: comments, empty lines, JSDoc blocks
- **Include**: imports, type interfaces, component logic, JSX markup

**Counting example:**
```typescript
// This line is NOT counted (comment)
import React from 'react'; // ← Counted (line 1)

interface Props { // ← Counted (line 2)
  name: string; // ← Counted (line 3)
} // ← Counted (line 4)

// Empty line is NOT counted

export const Component = ({ name }: Props) => { // ← Counted (line 5)
  return <div>{name}</div>; // ← Counted (line 6)
}; // ← Counted (line 7)
```

#### 1.4.2. Refactoring Strategies

If a component exceeds 100 lines, it is necessary to refactor using the following strategies:

**1. Splitting into Sub-components (Atomic Design)**
- Extract logical parts into separate components (Molecules, Atoms)
- Use composition to combine sub-components

**2. Extracting Logic into Custom Hooks**
- Move business logic and state into custom hooks
- Leave only presentation logic in the component

**3. Extracting Utility Functions**
- Extract calculations and data transformations into separate functions in `lib/`
- Use pure functions for data processing

**4. Using Component Composition**
- Apply Compound Components or Render Props patterns
- Split responsibilities between components

**Refactoring Example:**

```typescript
// ❌ BAD: Component exceeds 100 lines
export const UserProfile = ({ userId }: UserProfileProps) => {
  // ... 200+ lines of code with logic, state, handlers and JSX
};

// ✅ GOOD: Splitting into sub-components and hooks
// hooks/useUserProfile.ts
export const useUserProfile = (userId: string) => {
  // Logic for fetching and processing user data
};

// components/molecules/UserAvatar.tsx
export const UserAvatar = ({ user }: UserAvatarProps) => {
  // User avatar component
};

// components/molecules/UserInfo.tsx
export const UserInfo = ({ user }: UserInfoProps) => {
  // User information component
};

// components/organisms/UserProfile.tsx
export const UserProfile = ({ userId }: UserProfileProps) => {
  const { user, loading, error } = useUserProfile(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <UserAvatar user={user} />
      <UserInfo user={user} />
    </div>
  );
};
```

#### 1.4.3. When to Refactor

Refactoring is necessary when:

- Component exceeds 100 lines of code
- Component has multiple responsibilities (SRP violation)
- Component is difficult to test
- Component is difficult to maintain and extend
- Component has deep JSX nesting (>3 levels)

**Important**: Refactoring must preserve component functionality and not break existing interfaces.

---

## 2. 🧩 Component Structure and Patterns

### 2.1. Component File Structure
```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── Input/
├── molecules/
├── organisms/
└── layouts/
```

### 2.2. Component Template
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Universal Button component
 * @description Button with support for various variants and sizes
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  className,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

---

## 3. 🎨 Styling and Theming

### 3.1. CSS-in-JS or Utility-First Approach
Choose one consistent approach:

**Option A: CSS Modules**
```typescript
import styles from './Button.module.css';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button with CSS Modules
 */
export const Button = ({ className, ...props }: ButtonProps) => (
  <button className={cn(styles.button, className)} {...props} />
);
```

**Option B: Utility Classes (Tailwind CSS)**
```typescript
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button with Tailwind CSS
 */
export const Button = ({ className, ...props }: ButtonProps) => (
  <button className={cn('px-4 py-2 rounded-md', className)} {...props} />
);
```

**Option C: Styled Components**
```typescript
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  /* ... */
`;
```

### 3.2. Theme Support
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

---

## 4. 🔧 Component Patterns

### 4.1. Compound Components
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Base Card component
 */
const Card = ({ children, className }: CardProps) => (
  <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
    {children}
  </div>
);

/**
 * Card header component
 */
const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

/**
 * Card content component
 */
const CardContent = ({ children, className }: CardContentProps) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;

export { Card };
```

### 4.2. Render Props Pattern
```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

/**
 * Component for data fetching with render props pattern
 * @template T - Type of data being fetched
 */
export const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>): JSX.Element => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children(data, loading, error)}</>;
};
```

### 4.3. Higher-Order Components (HOCs)
```typescript
interface WithLoadingProps {
  isLoading: boolean;
}

/**
 * HOC for adding loading state to a component
 * @template P - Type of props for the wrapped component
 */
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WithLoadingComponent = (props: P & WithLoadingProps): JSX.Element => {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    return <Component {...(restProps as P)} />;
  };
  
  return WithLoadingComponent;
};
```

---

## 5. 🛡️ Error Handling and Boundaries

### 5.1. Error Boundary Component
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Default component for displaying errors
 */
const DefaultErrorFallback = ({ 
  error, 
  resetError 
}: DefaultErrorFallbackProps) => (
  <div className="p-4 border border-red-200 rounded-md bg-red-50">
    <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
    <p className="text-red-600">{error.message}</p>
    <button 
      onClick={resetError}
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);
```

---

## 6. ♿ Accessibility Guidelines

### 6.1. ARIA Attributes
```typescript
interface AccessibleButtonProps {
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  role?: string;
}

/**
 * Accessible button with full ARIA attributes support
 */
export const AccessibleButton = ({
  children,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  role,
  ...props
}: AccessibleButtonProps) => (
  <button
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    aria-expanded={ariaExpanded}
    aria-pressed={ariaPressed}
    role={role}
    {...props}
  >
    {children}
  </button>
);
```

### 6.2. Focus Management
```typescript
/**
 * Hook for managing focus within a container (focus trap)
 * @param isActive - Whether to activate the focus trap
 * @returns Ref for the container
 */
export const useFocusTrap = (isActive: boolean): React.RefObject<HTMLElement> => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};
```

---

## 8. 📦 Component Export Patterns

### 8.1. Barrel Exports
```typescript
// components/atoms/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Icon } from './Icon';

// components/index.ts
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './layouts';
```

### 8.2. Named vs Default Exports
```typescript
// Prefer named exports for better tree-shaking
export const Button = () => { /* ... */ };

// Use default export only for main component of a file
const Modal = () => { /* ... */ };
export default Modal;
```

---

## 9. 🚀 Performance Optimization

### 9.1. Memoization
```typescript
import React, { memo, useMemo, useCallback } from 'react';

interface ExpensiveComponentProps {
  data: ComplexData[];
  onItemClick: (id: string) => void;
}

/**
 * Optimized component with memoization
 */
export const ExpensiveComponent = memo(({ 
  data, 
  onItemClick 
}: ExpensiveComponentProps) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);

  const handleItemClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### 9.2. Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./HeavyComponent'));

/**
 * Example of Lazy Loading usage
 */
export const App = (): JSX.Element => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

---

## 10. ⏳ Loading States and Skeleton Components

### 10.1. Instant Page Rendering Requirement

**⚠️ MANDATORY REQUIREMENT**: When a user clicks a link that navigates to an application page, that page **MUST** open immediately, even if the page content is not yet fully loaded and rendered. Instead of missing content, a **skeleton placeholder** should be displayed for each content block. When content loads, the skeleton should disappear smoothly.

**Key Principles:**
- **Instant Navigation**: Pages should render immediately upon navigation
- **Skeleton Placeholders**: Each content block should have a corresponding skeleton
- **Smooth Transitions**: Skeleton should smoothly transition to actual content
- **Perceived Performance**: Users should see immediate feedback, improving UX

### 10.2. Skeleton Component Pattern

Skeleton components should mirror the structure of the actual content they represent:

```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface GradeCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton component for grade card
 * Mirrors the structure of GradeCard component
 */
export const GradeCardSkeleton = ({ className }: GradeCardSkeletonProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-32" /> {/* Title */}
          <Skeleton className="h-5 w-16 rounded-full" /> {/* Badge */}
        </div>
        <Skeleton className="h-4 w-full mt-2" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-3/4 mt-1" /> {/* Description line 2 */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" /> {/* Age range */}
      </CardContent>
    </Card>
  );
};
```

### 10.3. Next.js App Router Loading Patterns

#### 10.3.1. Using loading.tsx Files

In Next.js App Router, create `loading.tsx` files in route directories to automatically show loading states during navigation:

```typescript
// app/(private)/grades/loading.tsx
import { GradeListSkeleton } from '@/components/molecules/grades/grade-list-skeleton';

/**
 * Loading state for grades list page
 * Automatically shown during navigation to /grades
 */
export default function GradesLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-9 w-32 bg-muted animate-pulse rounded-md mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-11 w-32 bg-muted animate-pulse rounded-md" />
      </div>
      <GradeListSkeleton />
    </div>
  );
}
```

#### 10.3.2. Using Suspense Boundaries

For more granular control, use Suspense boundaries within pages:

```typescript
import { Suspense } from 'react';
import { GradeDetailContent } from './grade-detail-content';
import { GradeDetailSkeleton } from '@/components/molecules/grades/grade-detail-skeleton';

export default function GradeDetailPage({ params }: { params: Promise<{ gradeId: string }> }) {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <Suspense fallback={<GradeDetailSkeleton />}>
        <GradeDetailContent params={params} />
      </Suspense>
    </div>
  );
}
```

### 10.4. Skeleton Component Best Practices

1. **Match Structure**: Skeleton should match the exact structure of the actual content
2. **Appropriate Sizing**: Use realistic dimensions that match actual content
3. **Animation**: Use `animate-pulse` class for smooth pulsing animation
4. **Accessibility**: Include `aria-label` for screen readers:
   ```typescript
   <Skeleton 
     className="h-6 w-32" 
     aria-label="Loading grade information"
   />
   ```
5. **Responsive Design**: Ensure skeleton is responsive like actual content
6. **Multiple Variants**: Create skeleton variants for different content states (empty, loading, error)

### 10.5. Integration with shadcn/ui Skeleton

The project uses shadcn/ui Skeleton component:

```typescript
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Basic skeleton usage
 */
export const BasicSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-3/4" />
  </div>
);
```

### 10.6. Example: Complete Skeleton Implementation

```typescript
// components/molecules/grades/grade-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

/**
 * Skeleton for grades list
 * Displays 6 skeleton cards in a responsive grid
 */
export const GradeListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-4 w-24" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-11 w-full rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
```

### 10.7. AI Assistant Instructions

When creating components that load data:

1. **Create Skeleton Component**: Always create a corresponding skeleton component
2. **Match Structure**: Ensure skeleton mirrors the actual component structure
3. **Add loading.tsx**: Create `loading.tsx` files for route-level loading states
4. **Use Suspense**: Consider Suspense boundaries for granular loading control
5. **Test Navigation**: Verify instant page rendering on link clicks
6. **Responsive Design**: Ensure skeleton is responsive like actual content

---

## 11. 🤖 AI Assistant Instructions

When generating React components:

1. **Identify Component Level**: Determine if it's an Atom, Molecule, Organism, Layout, or Page
2. **Create TypeScript Interface**: Define explicit props interface with proper typing
3. **Use Explicit Typing**: Use `(props: PropsType)` instead of `React.FC<PropsType>` for better type inference, generic support, and flexibility
4. **Follow Naming Conventions**: Use PascalCase for components, descriptive prop names
5. **Write Pure Components**: Components should be pure functions without mutations
6. **Include Accessibility**: Add appropriate ARIA attributes and keyboard navigation
7. **Handle Edge Cases**: Consider loading states, error states, and empty states
8. **Optimize Performance**: Use memo, useMemo, useCallback when appropriate to prevent unnecessary re-renders
9. **Write Tests**: Include unit tests and accessibility tests
10. **Document Props**: Add JSDoc comments for all components and complex props (in English)

> **Example Prompt**: "Generate a reusable Modal component that follows accessibility guidelines, includes proper TypeScript typing, and can be used across different React frameworks."

---

## 12. 📚 References

- [React Documentation](https://react.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testing Library](https://testing-library.com/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [React Performance](https://react.dev/learn/render-and-commit)

> ✅ **This document provides universal React component guidelines** that work across all React-based frameworks while maintaining best practices for accessibility, performance, and maintainability.
