/**
 * Authentication utilities
 * Helper functions for working with user roles and authentication
 * Uses Server Actions for secure token access
 */

import { getCurrentUser } from '@/actions/auth';

export type UserRole = 'TEACHER' | 'ADMIN' | 'SUPERADMIN';

/**
 * Get current session from Cognito
 * Returns user information and role from JWT token
 * 
 * @returns User session data or null if not authenticated
 */
export async function getSession(): Promise<{
  id: string;
  email: string;
  name: string;
  role: UserRole;
  groups: string[];
} | null> {
  try {
    const result = await getCurrentUser();
    
    if (!result.success) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get user role from Cognito groups with precedence
 * Precedence: SUPERADMIN > ADMIN > TEACHER
 * 
 * @returns User role or null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const result = await getCurrentUser();
    
    if (!result.success) {
      return null;
    }

    return result.data.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Check if user has required role
 * 
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
 * 
 * @returns true if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const result = await getCurrentUser();
    return result.success;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

