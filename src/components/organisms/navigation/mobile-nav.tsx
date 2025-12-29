'use client';

/**
 * Mobile Navigation component with drawer/sheet
 * Client Component - handles mobile menu interactivity
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }> | null;
  roles: string[];
}

interface MobileNavProps {
  navItems: NavItem[];
  userRole: string;
}

export const MobileNav = ({ navItems, userRole }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Filter menu items based on user role
  const filteredItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-1 p-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
