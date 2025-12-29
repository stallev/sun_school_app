/**
 * Sidebar component for navigation menu
 * Server Component - displays navigation links based on user role
 */

import Link from 'next/link';
import { getUserRole } from '@/lib/utils/auth';
import {
  Home,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    href: '/grades/my',
    label: 'Мои группы',
    icon: Home,
    roles: ['TEACHER'],
  },
  {
    href: '/grades-list',
    label: 'Все группы',
    icon: Home,
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/schedule',
    label: 'Расписание',
    icon: Calendar,
    roles: ['TEACHER', 'ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/golden-verses-library',
    label: 'Золотые стихи',
    icon: BookOpen,
    roles: ['TEACHER', 'ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/teachers-management',
    label: 'Преподаватели',
    icon: GraduationCap,
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/pupils-management',
    label: 'Ученики',
    icon: Users,
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/families-management',
    label: 'Семьи',
    icon: Building2,
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: '/school-process-management',
    label: 'Настройки',
    icon: Settings,
    roles: ['ADMIN', 'SUPERADMIN'],
  },
];

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar = async ({ currentPath }: SidebarProps) => {
  const userRole = await getUserRole();
  
  if (!userRole) {
    return null;
  }
  
  // Filter menu items based on user role
  const filteredItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="hidden w-64 border-r bg-card md:flex md:flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || 
            (item.href !== '/' && currentPath?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
