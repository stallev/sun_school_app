/**
 * Header component for application navigation
 * Server Component - displays logo, navigation menu, user info, and logout button
 */

import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth/cognito';
import { getUserRole } from '@/lib/utils/auth';
import { RoutePath } from '@/lib/routes/RoutePath';
import { Logo } from '@/components/atoms/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut } from '@/actions/auth';
import { MobileNav } from './mobile-nav';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

// Navigation items configuration (shared with Sidebar)
// Using string identifiers for icons to avoid serialization issues when passing to Client Components
const navItems = [
  {
    href: RoutePath.grades.my,
    label: 'Мои группы',
    icon: 'Home',
    roles: ['TEACHER'],
  },
  {
    href: RoutePath.grades.base,
    label: 'Все группы',
    icon: 'Home',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.schedule,
    label: 'Расписание',
    icon: 'Calendar',
    roles: ['TEACHER', 'ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.goldenVersesLibrary.base,
    label: 'Золотые стихи',
    icon: 'BookOpen',
    roles: ['TEACHER', 'ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.teachersManagement.base,
    label: 'Преподаватели',
    icon: 'GraduationCap',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.pupilsManagement.base,
    label: 'Ученики',
    icon: 'Users',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.familiesManagement.base,
    label: 'Семьи',
    icon: 'Building2',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
  {
    href: RoutePath.schoolProcessManagement.base,
    label: 'Настройки',
    icon: 'Settings',
    roles: ['ADMIN', 'SUPERADMIN'],
  },
];

export const Header = async ({}: HeaderProps) => {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return null;
  }

  // Get user name from email (first part before @)
  const userName = user?.email?.split('@')[0] || 'User';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const userRole = await getUserRole() || 'TEACHER';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - integrated with MobileNav */}
          <MobileNav navItems={navItems} userRole={userRole} />
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="hidden font-semibold sm:inline-block">
              Sunday School App
            </span>
          </Link>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop: User Dropdown and Sign Out Button */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Sign Out Button - always visible */}
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span>Выход</span>
              </Button>
            </form>
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Выход</span>
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile: Simple Logout Button */}
          <form action={signOut} className="md:hidden">
            <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};
