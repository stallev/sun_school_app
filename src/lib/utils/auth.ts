/**
 * Authentication utilities
 * Helper functions for working with user roles and authentication
 */

import { getAuthenticatedUser } from '@/lib/auth/cognito';

export type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERADMIN';

/**
 * Get user role from Cognito groups
 * Returns the first role from user groups or 'TEACHER' as default
 * @returns User role or null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return null;
  }

  // Get first group (highest precedence)
  const role = user.groups[0] as UserRole;
  
  // Validate role
  if (['TEACHER', 'ADMIN', 'SUPERADMIN'].includes(role)) {
    return role;
  }

  // Default to TEACHER if role is not recognized
  return 'TEACHER';
}

/**
 * Check if user has required role
 * @param requiredRoles - Array of allowed roles
 * @returns true if user has one of the required roles
 */
export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const userRole = await getUserRole();
  
  if (!userRole) {
    return false;
  }

  return requiredRoles.includes(userRole);
}

/**
 * Check if user is authenticated
 * @returns true if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user !== null;
}

