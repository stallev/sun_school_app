'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RoutePath } from '@/lib/routes/RoutePath';

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
    let redirectUrl: string = RoutePath.grades.my;
    if (tokens.userRole === 'ADMIN' || tokens.userRole === 'SUPERADMIN') {
      redirectUrl = RoutePath.grades.base;
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
    const cookieStore = await cookies();
    
    // Clear authentication cookies with same options as when they were set
    cookieStore.set('cognito-id-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    cookieStore.set('cognito-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    cookieStore.set('cognito-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    // Redirect to login page
    redirect(RoutePath.auth);
  } catch (error) {
    // Type guard for Next.js redirect error
    // Next.js redirect() throws a special error that should be rethrown, not logged
    type RedirectError = Error & { digest?: string };
    const redirectError = error as RedirectError;
    const isRedirectError = error instanceof Error && (redirectError.digest?.startsWith('NEXT_REDIRECT') || error.message === 'NEXT_REDIRECT');
    
    if (isRedirectError) {
      // Rethrow redirect error - it should propagate to Next.js
      throw error;
    }
    
    // Only log non-redirect errors
    console.error('Error signing out:', error);
    
    // Even if there's an error, clear cookies and redirect
    const cookieStore = await cookies();
    cookieStore.set('cognito-id-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    cookieStore.set('cognito-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    cookieStore.set('cognito-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    
    redirect(RoutePath.auth);
  }
}

