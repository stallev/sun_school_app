'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { RoutePath } from '@/lib/routes/RoutePath';
import { signInSchema } from '@/lib/validation/auth';
import { getTeacherGradeIdsWithCache, invalidateTeacherGradeCache } from '../lib/utils/teacher-grade-cache';

/**
 * Schema for storing auth tokens
 */
const storeAuthTokensSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  userRole: z.enum(['TEACHER', 'ADMIN', 'SUPERADMIN'], {
    message: 'Invalid user role',
  }),
});

/**
 * Sign in Server Action
 * Validates credentials and stores authentication tokens in HttpOnly cookies
 * 
 * Note: For AWS Amplify Gen 1, signIn is performed on the client side,
 * and this Server Action stores the resulting tokens in cookies.
 * 
 * @param input - User credentials (email and password)
 * @returns Success with redirect URL or error message
 */
export async function signIn(input: unknown): Promise<
  | { success: true; redirectUrl: string }
  | { success: false; error: string }
> {
  try {
    // Validate input using Zod schema
    signInSchema.parse(input);

    // Note: For AWS Amplify Gen 1, actual signIn is performed on the client
    // This Server Action is called after client-side signIn succeeds
    // The tokens should be passed via storeAuthTokens Server Action
    
    // For now, return error indicating that signIn should be done on client
    // This will be updated when we integrate with client-side signIn
    return {
      success: false as const,
      error: 'Sign in must be performed on the client side. Use storeAuthTokens after successful client signIn.',
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false as const,
        error: firstError?.message || 'Ошибка валидации данных.',
      };
    }

    // Handle other errors
    console.error('Error in signIn Server Action:', error);
    return {
      success: false as const,
      error: 'Ошибка входа. Попробуйте еще раз.',
    };
  }
}

/**
 * Store authentication tokens in HttpOnly cookies
 * Called from client after successful signIn
 * Returns redirect URL instead of redirecting directly (to avoid NEXT_REDIRECT error)
 * 
 * @param tokens - Authentication tokens from Cognito
 * @returns Success with redirect URL or error message
 */
export async function storeAuthTokens(tokens: unknown): Promise<
  | { success: true; redirectUrl: string }
  | { success: false; error: string }
> {
  try {
    // Validate input using Zod schema
    const validatedTokens = storeAuthTokensSchema.parse(tokens);

    const cookieStore = await cookies();

    // Set HttpOnly cookies with secure settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    cookieStore.set('cognito-id-token', validatedTokens.idToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 24 hours (ID token expiration)
    });

    cookieStore.set('cognito-access-token', validatedTokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24, // 24 hours (Access token expiration)
    });

    if (validatedTokens.refreshToken) {
      cookieStore.set('cognito-refresh-token', validatedTokens.refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days (Refresh token expiration)
      });
    }

    // 4. If user is TEACHER, cache their grade IDs for access control optimization
    if (validatedTokens.userRole === 'TEACHER') {
      try {
        // Get user ID from idToken payload
        const payload = JSON.parse(
          Buffer.from(validatedTokens.idToken.split('.')[1], 'base64').toString()
        );
        const userId = payload.sub;

        if (userId) {
          // Fetch and cache teacher's grade IDs
          // This will make one GraphQL query and cache result in cookie
          // Subsequent access checks will use cache instead of making queries
          await getTeacherGradeIdsWithCache(userId);
        }
      } catch (error) {
        // Don't fail login if caching fails - it's optional optimization
        // App will work without cache, just slower (will make GraphQL queries)
        console.error('Error caching teacher grade IDs on login:', error);
      }
    }

    // Determine redirect URL based on user role
    let redirectUrl: string = RoutePath.grades.my;
    if (validatedTokens.userRole === 'ADMIN' || validatedTokens.userRole === 'SUPERADMIN') {
      redirectUrl = RoutePath.grades.base;
    }

    return {
      success: true as const,
      redirectUrl,
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false as const,
        error: firstError?.message || 'Ошибка валидации токенов.',
      };
    }

    // Handle other errors
    console.error('Error storing auth tokens:', error);
    return {
      success: false as const,
      error: 'Ошибка сохранения токенов аутентификации.',
    };
  }
}

/**
 * Get current authenticated user
 * Returns user information and role from JWT token stored in cookies
 * 
 * @returns Success with user data or error message
 */
export async function getCurrentUser(): Promise<
  | {
      success: true;
      data: {
        id: string;
        email: string;
        name: string;
        role: 'TEACHER' | 'ADMIN' | 'SUPERADMIN';
        groups: string[];
      };
    }
  | { success: false; error: string }
> {
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
    // For MVP, we decode without signature verification
    // In production, you might want to verify the token signature
    let payload: {
      sub?: string;
      email?: string;
      name?: string;
      'cognito:username'?: string;
      'cognito:groups'?: string[];
    };

    try {
      payload = JSON.parse(
        Buffer.from(idToken.split('.')[1], 'base64').toString()
      );
    } catch (decodeError) {
      console.error('Error decoding JWT token:', decodeError);
      return {
        success: false as const,
        error: 'Ошибка декодирования токена аутентификации.',
      };
    }

    const userGroups = payload['cognito:groups'] || [];
    // Get role with precedence: SUPERADMIN > ADMIN > TEACHER
    let userRole: 'TEACHER' | 'ADMIN' | 'SUPERADMIN' = 'TEACHER';
    if (userGroups.includes('SUPERADMIN')) {
      userRole = 'SUPERADMIN';
    } else if (userGroups.includes('ADMIN')) {
      userRole = 'ADMIN';
    } else if (userGroups.includes('TEACHER')) {
      userRole = 'TEACHER';
    }

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
 * 
 * @returns Never returns (always redirects)
 */
export async function signOut(): Promise<never> {
  try {
    const cookieStore = await cookies();

    // Clear authentication cookies with same options as when they were set
    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 0,
      path: '/',
    };

    cookieStore.set('cognito-id-token', '', clearCookieOptions);
    cookieStore.set('cognito-access-token', '', clearCookieOptions);
    cookieStore.set('cognito-refresh-token', '', clearCookieOptions);

    // Clear teacher grade IDs cache
    // This ensures that cached grade IDs are not left in cookies after logout
    try {
      await invalidateTeacherGradeCache();
    } catch (error) {
      // Don't fail logout if cache clearing fails
      // Cache clearing is cleanup, not critical for logout
      console.error('Error clearing teacher grade cache on logout:', error);
    }

    // Redirect to login page
    redirect(RoutePath.auth);
  } catch (error) {
    // Type guard for Next.js redirect error
    // Next.js redirect() throws a special error that should be rethrown, not logged
    type RedirectError = Error & { digest?: string };
    const redirectError = error as RedirectError;
    const isRedirectError =
      error instanceof Error &&
      (redirectError.digest?.startsWith('NEXT_REDIRECT') ||
        error.message === 'NEXT_REDIRECT');

    if (isRedirectError) {
      // Rethrow redirect error - it should propagate to Next.js
      throw error;
    }

    // Only log non-redirect errors
    console.error('Error signing out:', error);

    // Even if there's an error, clear cookies and redirect
    try {
      const cookieStore = await cookies();
      const clearCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 0,
        path: '/',
      };

      cookieStore.set('cognito-id-token', '', clearCookieOptions);
      cookieStore.set('cognito-access-token', '', clearCookieOptions);
      cookieStore.set('cognito-refresh-token', '', clearCookieOptions);
      
      // Clear teacher grade cache in error handler too
      try {
        await invalidateTeacherGradeCache();
      } catch (clearCacheError) {
        console.error('Error clearing teacher grade cache in error handler:', clearCacheError);
      }
    } catch (clearError) {
      console.error('Error clearing cookies:', clearError);
    }

    redirect(RoutePath.auth);
  }
}

