# Next.js Loading Patterns Guidelines

## Document Version: 1.0
**Creation Date:** 27 December 2025  
**Last Update:** 27 December 2025  
**Project:** Sunday School App  
**Technologies:** Next.js 15.5.9 (App Router, Server Components), React 19, TypeScript, shadcn/ui

> [!NOTE]
> Documentation is based on current sources:
> - Next.js 15.5.9 — official Vercel documentation  
> - React 19 — official documentation  
> - shadcn/ui — official documentation

---

## 1. Overview

This document provides comprehensive guidelines for implementing loading states and skeleton components in Next.js 15.5.9 App Router applications. The focus is on **instant page rendering** with skeleton placeholders that improve perceived performance and user experience.

**Key Principle**: When a user clicks a link to navigate to a page, that page **MUST** open immediately, even if content is not yet loaded. Skeleton placeholders should be displayed for each content block until data is ready.

---

## 2. Next.js App Router Loading Mechanisms

### 2.1. loading.tsx Files

Next.js App Router automatically uses `loading.tsx` files to show loading states during navigation. These files are **special files** that Next.js recognizes and uses automatically.

**File Location**: Place `loading.tsx` in the same directory as your `page.tsx`:

```
app/
├── (private)/
│   └── grades/
│       ├── page.tsx          # Main page component
│       ├── loading.tsx        # Loading state (shown during navigation)
│       └── [gradeId]/
│           ├── page.tsx      # Detail page
│           └── loading.tsx   # Detail page loading state
```

**Automatic Behavior**:
- When user navigates to `/grades`, Next.js shows `loading.tsx` immediately
- While `page.tsx` is loading data, `loading.tsx` is displayed
- Once `page.tsx` is ready, it replaces `loading.tsx` automatically
- No manual Suspense boundaries needed for route-level loading

**Example**:

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

### 2.2. Suspense Boundaries

For more granular control over loading states within a page, use React Suspense boundaries:

```typescript
import { Suspense } from 'react';
import { GradeDetailContent } from './grade-detail-content';
import { GradeDetailSkeleton } from '@/components/molecules/grades/grade-detail-skeleton';

export default function GradeDetailPage({ 
  params 
}: { 
  params: Promise<{ gradeId: string }> 
}) {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <Suspense fallback={<GradeDetailSkeleton />}>
        <GradeDetailContent params={params} />
      </Suspense>
    </div>
  );
}
```

**When to Use Suspense**:
- When you need different loading states for different sections
- When some content loads faster than others
- When you want to show partial content while other parts load

---

## 3. Skeleton Component Patterns

### 3.1. Creating Skeleton Components

Skeleton components should **mirror the exact structure** of the actual content they represent:

```typescript
// components/molecules/grades/grade-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

/**
 * Skeleton for grades list
 * Displays 6 skeleton cards in a responsive grid
 * Matches the structure of GradesList component
 */
export const GradeListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3 lg:gap-8 lg:p-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex flex-col h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-32" /> {/* Title */}
              <Skeleton className="h-5 w-16 rounded-full" /> {/* Badge */}
            </div>
            <Skeleton className="h-4 w-full mt-2" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-3/4 mt-1" /> {/* Description line 2 */}
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-4 w-24" /> {/* Age range */}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-11 w-full rounded-md" /> {/* Button */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
```

### 3.2. Skeleton Component Best Practices

1. **Match Structure**: Skeleton should match the exact structure of actual content
2. **Realistic Dimensions**: Use dimensions that match actual content sizes
3. **Animation**: Use `animate-pulse` class for smooth pulsing animation
4. **Accessibility**: Include `aria-label` for screen readers:
   ```typescript
   <Skeleton 
     className="h-6 w-32" 
     aria-label="Loading grade information"
   />
   ```
5. **Responsive Design**: Ensure skeleton is responsive like actual content
6. **Component Size**: Keep skeleton components under 100 lines (follow component size limit)

### 3.3. Complex Skeleton Example

For complex pages with multiple sections:

```typescript
// components/molecules/grades/grade-detail-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

/**
 * Skeleton for grade detail page
 * Matches the structure of GradeDetailPage component
 */
export const GradeDetailSkeleton = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Grade Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-2" /> {/* Title */}
              <Skeleton className="h-5 w-full" /> {/* Description */}
              <Skeleton className="h-4 w-32 mt-2" /> {/* Age range */}
            </div>
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge */}
          </div>
        </CardHeader>
      </Card>

      {/* Grade Actions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" /> {/* Actions title */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      </div>

      {/* Pupils Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## 4. Integration with Server Components

### 4.1. Server Components and Loading States

Server Components work seamlessly with loading states:

1. **Server Component** (`page.tsx`) loads data asynchronously
2. **loading.tsx** is shown immediately during navigation
3. Once Server Component is ready, it replaces `loading.tsx`

**Example**:

```typescript
// app/(private)/grades/page.tsx (Server Component)
export default async function GradesPage() {
  const user = await getAuthenticatedUser();
  const result = await listGradesAction();
  
  // This component loads data on server
  // loading.tsx is shown automatically during this time
  return <GradesList grades={result.data || []} />;
}
```

### 4.2. Combining Server Actions with Loading States

Server Actions can trigger revalidation, which will show loading states:

```typescript
// actions/grades.ts
'use server';

export async function createGradeAction(data: GradeInput) {
  // ... create grade logic
  revalidatePath('/grades'); // Triggers revalidation
  // Next.js will show loading.tsx during revalidation
}
```

---

## 5. Best Practices

### 5.1. Instant Page Rendering

- ✅ **DO**: Create `loading.tsx` for every route that loads data
- ✅ **DO**: Use skeleton components that match actual content structure
- ✅ **DO**: Ensure skeleton is responsive like actual content
- ❌ **DON'T**: Show blank pages while loading
- ❌ **DON'T**: Use generic "Loading..." text without skeleton

### 5.2. Skeleton Component Design

- ✅ **DO**: Match exact structure of actual content
- ✅ **DO**: Use realistic dimensions
- ✅ **DO**: Include accessibility labels
- ✅ **DO**: Keep components under 100 lines
- ❌ **DON'T**: Use placeholder text in skeletons
- ❌ **DON'T**: Create skeletons that don't match content structure

### 5.3. Performance Considerations

- ✅ **DO**: Use Server Components for data loading
- ✅ **DO**: Minimize client-side JavaScript
- ✅ **DO**: Use ISR for pages that don't need real-time data
- ❌ **DON'T**: Load unnecessary data in loading states
- ❌ **DON'T**: Block navigation with heavy computations

---

## 6. Examples for Grades Pages

### 6.1. Grades List Page

**File Structure**:
```
app/(private)/grades/
├── page.tsx          # Server Component with data loading
├── loading.tsx       # Loading state with GradeListSkeleton
└── components/
    └── molecules/
        └── grades/
            └── grade-list-skeleton.tsx
```

**Implementation**:

```typescript
// app/(private)/grades/loading.tsx
import { GradeListSkeleton } from '@/components/molecules/grades/grade-list-skeleton';

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

### 6.2. Grade Detail Page

**File Structure**:
```
app/(private)/grades/[gradeId]/
├── page.tsx          # Server Component with data loading
├── loading.tsx       # Loading state with GradeDetailSkeleton
└── components/
    └── molecules/
        └── grades/
            └── grade-detail-skeleton.tsx
```

**Implementation**:

```typescript
// app/(private)/grades/[gradeId]/loading.tsx
import { GradeDetailSkeleton } from '@/components/molecules/grades/grade-detail-skeleton';

export default function GradeDetailLoading() {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <GradeDetailSkeleton />
    </div>
  );
}
```

---

## 7. Testing Loading States

### 7.1. Manual Testing

1. **Navigation Test**: Click link to page → page should open immediately with skeleton
2. **Content Replacement**: Wait for data → skeleton should smoothly transition to content
3. **Responsive Test**: Test on mobile, tablet, desktop → skeleton should be responsive
4. **Accessibility Test**: Use screen reader → skeleton should have proper labels

### 7.2. Performance Testing

- Measure Time to First Byte (TTFB)
- Measure First Contentful Paint (FCP)
- Verify skeleton appears immediately (< 100ms)
- Verify smooth transition to content

---

## 8. Troubleshooting

### 8.1. Skeleton Not Showing

**Problem**: `loading.tsx` is not being used during navigation.

**Solutions**:
- Ensure `loading.tsx` is in the same directory as `page.tsx`
- Check that `page.tsx` is an async Server Component
- Verify Next.js version is 15.5.9 or higher
- Check browser console for errors

### 8.2. Skeleton Structure Mismatch

**Problem**: Skeleton doesn't match actual content structure.

**Solutions**:
- Review actual component structure
- Update skeleton to match exactly
- Test on different screen sizes
- Verify responsive breakpoints match

### 8.3. Performance Issues

**Problem**: Skeleton causes performance issues.

**Solutions**:
- Reduce number of skeleton items
- Optimize skeleton component rendering
- Use Server Components for data loading
- Consider ISR for static content

---

## 9. Cross-References

- **React Components Guidelines**: `docs/guidelines/react/ai_component_guidelines.md` - Section 10 (Loading States)
- **Server Components**: `docs/components/SERVER_COMPONENTS.md` - Loading states with Server Components
- **ISR Optimization**: `docs/guidelines/nextjs/ai_isr_optimization_guidelines.md` - Combining ISR with loading states
- **Component Library**: `docs/components/COMPONENT_LIBRARY.md` - Skeleton component examples

---

## 10. AI Assistant Instructions

When implementing loading states:

1. **Identify Loading Needs**: Determine which pages need loading states
2. **Create Skeleton Components**: Create skeleton components that match actual content
3. **Add loading.tsx Files**: Create `loading.tsx` files for route-level loading
4. **Test Navigation**: Verify instant page rendering on link clicks
5. **Ensure Responsiveness**: Make skeleton responsive like actual content
6. **Add Accessibility**: Include proper ARIA labels for screen readers
7. **Follow Best Practices**: Match structure, use realistic dimensions, keep under 100 lines

---

**Version:** 1.0  
**Last Updated:** 27 December 2025  
**Author:** AI Documentation Team

