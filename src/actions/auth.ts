'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signOut as amplifySignOut } from 'aws-amplify/auth';

/**
 * Store authentication tokens in HttpOnly cookies
 * Called from client after successful signIn
 * Returns redirect URL instead of redirecting directly (to avoid NEXT_REDIRECT error)
 */
export async function storeAuthTokens(tokens: {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  userRole: string;
}) {
  try {
    const cookieStore = await cookies();

    // Set HttpOnly cookies
    cookieStore.set('cognito-id-token', tokens.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    cookieStore.set('cognito-access-token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    if (tokens.refreshToken) {
      cookieStore.set('cognito-refresh-token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    // Determine redirect URL based on user role
    let redirectUrl = '/grades/my';
    if (tokens.userRole === 'ADMIN' || tokens.userRole === 'SUPERADMIN') {
      redirectUrl = '/grades-list';
    }

    return {
      success: true as const,
      redirectUrl,
    };
  } catch (error) {
    console.error('Error storing auth tokens:', error);
    return {
      success: false as const,
      error: 'Ошибка сохранения токенов аутентификации.',
    };
  }
}

/**
 * Get current authenticated user
 * Returns user information and role from JWT token
 */
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get('cognito-id-token')?.value;

    if (!idToken) {
      return {
        success: false as const,
        error: 'Пользователь не авторизован.',
      };
    }

    // Decode JWT token to get user info and groups
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString()
    );

    const userGroups = payload['cognito:groups'] || [];
    const userRole = userGroups[0] || 'TEACHER';

    return {
      success: true as const,
      data: {
        id: payload.sub || '',
        email: payload.email || '',
        name: payload.name || payload['cognito:username'] || '',
        role: userRole,
        groups: userGroups,
      },
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false as const,
      error: 'Ошибка получения информации о пользователе.',
    };
  }
}

/**
 * Sign out the current user
 * Clears authentication cookies and redirects to login page
 */
export async function signOut() {
  try {
    // Try to sign out from Amplify (client-side should handle this)
    try {
      await amplifySignOut();
    } catch (error) {
      // Ignore errors from Amplify signOut, we'll clear cookies anyway
      console.warn('Amplify signOut error (ignored):', error);
    }
    
    const cookieStore = await cookies();
    
    // Clear authentication cookies
    cookieStore.delete('cognito-id-token');
    cookieStore.delete('cognito-access-token');
    cookieStore.delete('cognito-refresh-token');
    
    // Redirect to login page
    redirect('/auth');
  } catch (error) {
    console.error('Error signing out:', error);
    
    // Even if there's an error, clear cookies and redirect
    const cookieStore = await cookies();
    cookieStore.delete('cognito-id-token');
    cookieStore.delete('cognito-access-token');
    cookieStore.delete('cognito-refresh-token');
    
    redirect('/auth');
  }
}

