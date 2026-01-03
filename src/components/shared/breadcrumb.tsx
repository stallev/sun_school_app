/**
 * App Breadcrumb Component
 * Reusable breadcrumb component for use across different pages
 * Server Component by default
 */

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface AppBreadcrumbItem {
  label: string;
  href?: string; // If not provided, element is displayed as current page (BreadcrumbPage)
}

interface AppBreadcrumbProps {
  items: AppBreadcrumbItem[];
}

/**
 * Reusable breadcrumb component
 * 
 * @param items - Array of breadcrumb items. Items with href are links, items without href are current page
 * 
 * @example
 * <AppBreadcrumb 
 *   items={[
 *     { label: 'Dashboard', href: '/grades' },
 *     { label: 'Все группы' } // current page, no href
 *   ]} 
 * />
 */
export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasHref = item.href !== undefined && item.href !== null;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {hasHref && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href!}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

