/**
 * Authentication page - Sign in
 * Server Component that renders the sign-in form
 */

import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/cognito';
import { SignInForm } from './sign-in-form';

export default async function AuthPage() {
  // Check if user is already authenticated
  const user = await getAuthenticatedUser();
  
  if (user) {
    // User is already authenticated, redirect based on role
    const userGroups = user.groups || [];
    const userRole = userGroups[0] || 'TEACHER';
    
    if (userRole === 'TEACHER') {
      redirect('/grades/my');
    } else if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      redirect('/grades-list');
    } else {
      redirect('/grades/my');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sunday School App</h1>
          <p className="mt-2 text-muted-foreground">Вход в систему</p>
        </div>
        
        <SignInForm />
      </div>
    </div>
  );
}

