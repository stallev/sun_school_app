/**
 * MainLayout component that combines all layout components
 * Server Component - provides adaptive layout for Desktop and Mobile
 */

import { Header } from '@/components/organisms/navigation/header';
import { Sidebar } from '@/components/organisms/navigation/sidebar';
import { Footer } from './footer';
import { getAuthenticatedUser } from '@/lib/auth/cognito';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const MainLayout = async ({ children, currentPath }: MainLayoutProps) => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - always visible */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - Desktop only */}
        <Sidebar currentPath={currentPath} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
