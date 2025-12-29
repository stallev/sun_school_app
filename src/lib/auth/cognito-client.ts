/**
 * AWS Cognito client-side authentication helpers
 * Used for signIn on the client side, then tokens are passed to server
 */

import { signIn as amplifySignIn, fetchAuthSession } from 'aws-amplify/auth';

/**
 * Sign in user with email and password (client-side)
 * Returns tokens that should be passed to server for cookie storage
 */
export async function signInClient(email: string, password: string) {
  try {
    // Sign in with AWS Amplify Auth (client-side)
    const { isSignedIn, nextStep } = await amplifySignIn({
      username: email,
      password,
    });

    if (!isSignedIn) {
      // Handle additional steps (e.g., MFA, password change)
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        return {
          success: false as const,
          error: 'Требуется подтверждение через MFA код.',
        };
      }

      return {
        success: false as const,
        error: 'Неверный email или пароль.',
      };
    }

    // Fetch auth session to get tokens
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const accessToken = session.tokens?.accessToken;
    const refreshToken = (session.tokens as { refreshToken?: string })?.refreshToken;

    if (!idToken || !accessToken) {
      return {
        success: false as const,
        error: 'Ошибка получения токенов аутентификации.',
      };
    }

    // Convert tokens to strings
    const idTokenString = typeof idToken === 'string' ? idToken : idToken.toString();
    const accessTokenString = typeof accessToken === 'string' ? accessToken : accessToken.toString();
    const refreshTokenString = refreshToken || '';

    // Decode access token to get groups
    let userGroups: string[] = [];
    let userRole = 'TEACHER';

    try {
      // Decode base64 in browser (Buffer is not available)
      const base64Url = accessTokenString.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      userGroups = payload['cognito:groups'] || [];
      userRole = userGroups[0] || 'TEACHER';
    } catch (error) {
      console.error('Error decoding access token:', error);
    }

    return {
      success: true as const,
      data: {
        idToken: idTokenString,
        accessToken: accessTokenString,
        refreshToken: refreshTokenString,
        userRole,
        userGroups,
      },
    };
  } catch (error: unknown) {
    console.error('Sign in error:', error);
    return {
      success: false as const,
      error: 'Ошибка входа. Попробуйте еще раз.',
    };
  }
}

