# Suspense for Fast Page Navigation

## Document Version: 1.0
**Creation Date:** December 27, 2025  
**Last Update:** December 27, 2025  
**Project:** Sunday School App  
**Technologies:** Next.js 15.5.9 (App Router, Server Components), React 19, TypeScript

---

## Overview

Use **Suspense boundaries** to ensure instant page opening. Instead of waiting for all data loading, the page opens immediately with a skeleton placeholder.

**Key Principle**: Page **MUST** open instantly on navigation, showing skeleton while content loads asynchronously.

---

## Problem: Synchronous Loading

```typescript
// ❌ BAD: Page won't open until all await operations complete
export default async function GradeDetailPage({ params }: { params: Promise<{ gradeId: string }> }) {
  const { gradeId } = await params;
  const user = await getAuthenticatedUser();
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId }); // Blocks page opening
  
  return <div>...</div>;
}
```

---

## Solution: Suspense Boundaries

### Step 1: Create Content Component

**File**: `src/app/(private)/grades/[gradeId]/grade-detail-content.tsx`

```typescript
import { notFound, redirect } from 'next/navigation';
import { getGradeWithFullDataAction } from '@/actions/grades';
import { RoutePath } from '@/lib/routes/RoutePath';
// ... other imports

export async function GradeDetailContent({ gradeId }: { gradeId: string }) {
  const gradeResult = await getGradeWithFullDataAction({ id: gradeId });

  if (!gradeResult.success) {
    if (gradeResult.error.includes('not found')) notFound();
    redirect(RoutePath.grades.base);
  }

  const { grade, pupils, teachers, academicYears } = gradeResult.data!;
  // ... render content
}
```

### Step 2: Create Skeleton Component

**File**: `src/app/(private)/grades/[gradeId]/grade-detail-skeleton.tsx`

```typescript
import { GradeDetailSkeleton } from '@/components/molecules/grades/grade-detail-skeleton';

export function GradeDetailSkeleton() {
  return <GradeDetailSkeleton />;
}
```

### Step 3: Update page.tsx

**File**: `src/app/(private)/grades/[gradeId]/page.tsx`

```typescript
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/cognito';
import { RoutePath } from '@/lib/routes/RoutePath';
import { GradeDetailContent } from './grade-detail-content';
import { GradeDetailSkeleton } from './grade-detail-skeleton';

export default async function GradeDetailPage({
  params,
}: {
  params: Promise<{ gradeId: string }>;
}) {
  const { gradeId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect(RoutePath.auth);

  // ✅ GOOD: Page opens instantly, content loads asynchronously
  return (
    <div className="container max-w-5xl p-4 md:p-6 lg:p-8">
      <Suspense fallback={<GradeDetailSkeleton />}>
        <GradeDetailContent gradeId={gradeId} />
      </Suspense>
    </div>
  );
}
```

---

## Key Points

- **page.tsx**: Only authentication checks
- **Content Component**: All data loading
- **Suspense**: Wraps content with skeleton fallback

---

**Last Update:** December 27, 2025  
**Next.js Version:** 15.5.9
