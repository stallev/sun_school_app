/**
 * AWS Cognito authentication helpers for Server Actions
 * Used to get current user and check authorization in Server Actions
 * 
 * Note: For MVP, we use a simplified approach that checks for token presence.
 * Full JWT verification can be added later if needed.
 */

import { cookies } from 'next/headers';

/**
 * Get current authenticated user from Cognito JWT token
 * @returns User information from JWT token or null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<{
  id: string;
  email: string;
  groups: string[];
} | null> {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get('cognito-id-token')?.value;

    if (!idToken) {
      return null;
    }

    // For MVP: decode JWT token to get user info
    // In production, you might want to verify the token signature
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString()
    );

    return {
      id: payload.sub || '',
      email: payload.email || '',
      groups: payload['cognito:groups'] || [],
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Check if user has required role
 * @param user - User object from getAuthenticatedUser
 * @param allowedRoles - Array of allowed roles
 * @returns true if user has required role
 */
export function checkRole(
  user: { groups: string[] } | null,
  allowedRoles: string[]
): boolean {
  if (!user) {
    return false;
  }

  return user.groups.some((group) => allowedRoles.includes(group));
}

