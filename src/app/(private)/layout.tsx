import type { Metadata } from 'next';
import { MainLayout } from '@/components/organisms/layout/main-layout';
import { LoadTeachersOnAuth } from '@/components/shared/load-teachers-on-auth';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Sunday School App',
  description: 'Sunday School Management System',
};

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  return (
    <MainLayout currentPath={pathname}>
      <LoadTeachersOnAuth />
      {children}
    </MainLayout>
  );
}

