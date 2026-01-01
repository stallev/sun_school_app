/**
 * Next.js Middleware for route protection
 * Protects private routes and admin routes based on JWT token and user roles
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RoutePath, getPublicRoutes, getProtectedRoutes, getAdminRoutes } from '@/lib/routes/RoutePath';

/**
 * Decode JWT token to get user information
 * Optimized for middleware performance - minimal operations
 * For MVP, we decode without signature verification
 * In production, you might want to verify the token signature
 * 
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
function decodeJWT(token: string): {
  sub?: string;
  email?: string;
  'cognito:groups'?: string[];
  exp?: number;
} | null {
  try {
    // Fast path: check if token has required structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString()
    );
    return payload;
  } catch {
    // Silently fail in middleware to avoid log spam
    return null;
  }
}

/**
 * Check if token is expired
 * Optimized for middleware performance
 * 
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.sub) {
      return true;
    }

    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    if (payload.exp && typeof payload.exp === 'number') {
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      return now >= expirationTime;
    }

    // If no expiration claim, consider it valid (for MVP)
    return false;
  } catch {
    // Silently fail in middleware
    return true;
  }
}

/**
 * Get user role from Cognito groups with precedence
 * Precedence: SUPERADMIN > ADMIN > TEACHER
 * 
 * @param groups - Array of Cognito groups
 * @returns User role or 'TEACHER' as default
 */
function getUserRole(groups: string[]): 'TEACHER' | 'ADMIN' | 'SUPERADMIN' {
  if (groups.includes('SUPERADMIN')) {
    return 'SUPERADMIN';
  }
  if (groups.includes('ADMIN')) {
    return 'ADMIN';
  }
  return 'TEACHER';
}

/**
 * Middleware function to protect routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get('cognito-id-token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = getPublicRoutes();
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Protected routes (require authentication)
  const protectedRoutes = getProtectedRoutes();
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Admin routes (require ADMIN or SUPERADMIN role)
  const adminRoutes = getAdminRoutes();
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Static files and Next.js internals - allow without authentication
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    // If user is already authenticated and tries to access /auth, redirect based on role
    if (pathname.startsWith(RoutePath.auth) && idToken && !isTokenExpired(idToken)) {
      const decoded = decodeJWT(idToken);
      if (decoded) {
        const groups = decoded['cognito:groups'] || [];
        const userRole = getUserRole(groups);

        // Redirect based on role
        if (userRole === 'TEACHER') {
          return NextResponse.redirect(new URL(RoutePath.grades.my, request.url));
        } else if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
          return NextResponse.redirect(new URL(RoutePath.grades.base, request.url));
        }
      }
    }

    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute || isAdminRoute) {
    // Check if user is authenticated
    if (!idToken || isTokenExpired(idToken)) {
      // Redirect to login page with redirect parameter
      const loginUrl = new URL(RoutePath.auth, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode token to get user groups
    const decoded = decodeJWT(idToken);
    if (!decoded) {
      // Invalid token, redirect to login
      const loginUrl = new URL(RoutePath.auth, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const groups = decoded['cognito:groups'] || [];
    const userRole = getUserRole(groups);

    // Check admin routes access
    if (isAdminRoute) {
      if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        // Teacher trying to access admin route, redirect to their home
        return NextResponse.redirect(new URL(RoutePath.grades.my, request.url));
      }
    }

    // Allow access to protected routes
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Matches all routes except static files and API routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$).*)',
  ],
};

