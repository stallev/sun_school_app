'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Sign out the current user
 * Clears authentication cookies and redirects to login page
 */
export async function signOut() {
  try {
    const cookieStore = await cookies();
    
    // Clear authentication cookies
    cookieStore.delete('cognito-id-token');
    cookieStore.delete('cognito-access-token');
    cookieStore.delete('cognito-refresh-token');
    
    // Redirect to login page
    redirect('/auth');
  } catch (error) {
    console.error('Error signing out:', error);
    // Even if there's an error, try to redirect
    redirect('/auth');
  }
}

