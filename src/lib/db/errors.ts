/**
 * Data Access Layer Error Handling
 * Provides typed error classes for GraphQL, network, and authorization errors
 */

/**
 * Base error class for Data Access Layer errors
 */
export class DataAccessError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DataAccessError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataAccessError);
    }
  }
}

/**
 * GraphQL/AppSync specific errors
 */
export class GraphQLError extends DataAccessError {
  constructor(
    message: string,
    public readonly errors?: Array<{ message: string; path?: (string | number)[] }>,
    originalError?: unknown
  ) {
    super(message, 'GRAPHQL_ERROR', originalError);
    this.name = 'GraphQLError';
  }

  /**
   * Get first error message
   */
  getFirstError(): string {
    return this.errors?.[0]?.message || this.message;
  }

  /**
   * Get all error messages
   */
  getAllErrors(): string[] {
    return this.errors?.map((e) => e.message) || [this.message];
  }
}

/**
 * Network errors (connection issues, timeouts)
 */
export class NetworkError extends DataAccessError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    originalError?: unknown
  ) {
    super(message, 'NETWORK_ERROR', originalError);
    this.name = 'NetworkError';
  }

  /**
   * Check if error is due to network timeout
   */
  isTimeout(): boolean {
    return this.message.toLowerCase().includes('timeout') ||
           this.message.toLowerCase().includes('timed out');
  }

  /**
   * Check if error is due to network connection
   */
  isConnectionError(): boolean {
    return this.message.toLowerCase().includes('network') ||
           this.message.toLowerCase().includes('connection') ||
           this.message.toLowerCase().includes('fetch failed');
  }
}

/**
 * Authentication errors (Cognito, unauthorized)
 */
export class AuthenticationError extends DataAccessError {
  constructor(
    message: string,
    public readonly cognitoErrorCode?: string,
    originalError?: unknown
  ) {
    super(message, 'AUTHENTICATION_ERROR', originalError);
    this.name = 'AuthenticationError';
  }

  /**
   * Check if error is due to expired token
   */
  isTokenExpired(): boolean {
    return this.cognitoErrorCode === 'NotAuthorizedException' ||
           this.message.toLowerCase().includes('expired') ||
           this.message.toLowerCase().includes('token');
  }
}

/**
 * Authorization errors (403, insufficient permissions)
 */
export class AuthorizationError extends DataAccessError {
  constructor(
    message: string,
    public readonly requiredPermission?: string,
    originalError?: unknown
  ) {
    super(message, 'AUTHORIZATION_ERROR', originalError);
    this.name = 'AuthorizationError';
  }
}

/**
 * Validation errors (input validation failures)
 */
export class ValidationError extends DataAccessError {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', originalError);
    this.name = 'ValidationError';
  }
}

/**
 * Not found errors (resource doesn't exist)
 */
export class NotFoundError extends DataAccessError {
  constructor(
    message: string,
    public readonly resourceType?: string,
    public readonly resourceId?: string,
    originalError?: unknown
  ) {
    super(message, 'NOT_FOUND_ERROR', originalError);
    this.name = 'NotFoundError';
  }
}

/**
 * Rate limiting errors (too many requests)
 */
export class RateLimitError extends DataAccessError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    originalError?: unknown
  ) {
    super(message, 'RATE_LIMIT_ERROR', originalError);
    this.name = 'RateLimitError';
  }
}

/**
 * Extract GraphQL errors from structured error object
 */
function extractGraphQLErrors(error: unknown): Array<{ message: string; path?: (string | number)[] }> | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const errorObj = error as Record<string, unknown>;

  // Check for errors array (GraphQL response format)
  if (Array.isArray(errorObj.errors)) {
    return errorObj.errors.map((e: unknown) => {
      if (e && typeof e === 'object') {
        const err = e as Record<string, unknown>;
        return {
          message: String(err.message || 'Unknown GraphQL error'),
          path: Array.isArray(err.path) ? err.path as (string | number)[] : undefined,
        };
      }
      return {
        message: String(e || 'Unknown GraphQL error'),
      };
    });
  }

  // Check for errorInfo.errors (Amplify format)
  if (errorObj.errorInfo && typeof errorObj.errorInfo === 'object') {
    const errorInfo = errorObj.errorInfo as Record<string, unknown>;
    if (Array.isArray(errorInfo.errors)) {
      return errorInfo.errors.map((e: unknown) => {
        if (e && typeof e === 'object') {
          const err = e as Record<string, unknown>;
          return {
            message: String(err.message || 'Unknown GraphQL error'),
            path: Array.isArray(err.path) ? err.path as (string | number)[] : undefined,
          };
        }
        return {
          message: String(e || 'Unknown GraphQL error'),
        };
      });
    }
  }

  // Check for single error object with message
  if (errorObj.message && typeof errorObj.message === 'string') {
    return [{
      message: errorObj.message,
      path: Array.isArray(errorObj.path) ? errorObj.path as (string | number)[] : undefined,
    }];
  }

  return undefined;
}

/**
 * Parse error from unknown error type
 * Attempts to classify and wrap unknown errors into typed error classes
 */
export function parseError(error: unknown): DataAccessError {
  // Log original error for debugging
  console.error('[parseError] Original error:', {
    type: error instanceof Error ? error.constructor.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    keys: error && typeof error === 'object' ? Object.keys(error) : [],
    fullError: error,
  });

  // If already a DataAccessError, return as is
  if (error instanceof DataAccessError) {
    return error;
  }

  // Check for structured GraphQL errors first (before checking Error type)
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    
    // Check for GraphQL errors array
    const graphQLErrors = extractGraphQLErrors(error);
    if (graphQLErrors && graphQLErrors.length > 0) {
      const firstError = graphQLErrors[0];
      return new GraphQLError(
        firstError.message,
        graphQLErrors,
        error
      );
    }

    // Check for AppSync error extensions
    if (errorObj.extensions && typeof errorObj.extensions === 'object') {
      const extensions = errorObj.extensions as Record<string, unknown>;
      if (extensions.errorType) {
        const errorType = String(extensions.errorType);
        const errorMessage = String(errorObj.message || extensions.errorInfo || 'AppSync error');
        
        // Check error type for classification
        if (errorType.includes('Unauthorized') || errorType.includes('Authentication')) {
          return new AuthenticationError(errorMessage, errorType, error);
        }
        if (errorType.includes('Forbidden') || errorType.includes('Authorization')) {
          return new AuthorizationError(errorMessage, undefined, error);
        }
        if (errorType.includes('NotFound')) {
          return new NotFoundError(errorMessage, undefined, undefined, error);
        }
        
        // Default to GraphQL error for AppSync errors
        return new GraphQLError(errorMessage, undefined, error);
      }
    }

    // Check for errorType field (AppSync format)
    if (errorObj.errorType && typeof errorObj.errorType === 'string') {
      const errorType = errorObj.errorType;
      const errorMessage = String(errorObj.message || errorObj.errorInfo || 'AppSync error');
      
      if (errorType.includes('Unauthorized') || errorType.includes('Authentication')) {
        return new AuthenticationError(errorMessage, errorType, error);
      }
      if (errorType.includes('Forbidden') || errorType.includes('Authorization')) {
        return new AuthorizationError(errorMessage, undefined, error);
      }
      if (errorType.includes('NotFound')) {
        return new NotFoundError(errorMessage, undefined, undefined, error);
      }
      
      return new GraphQLError(errorMessage, undefined, error);
    }
  }

  // If it's a standard Error, check the message
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Check for authentication errors
    if (
      message.includes('unauthorized') ||
      message.includes('authentication') ||
      message.includes('cognito') ||
      message.includes('token')
    ) {
      return new AuthenticationError(
        error.message,
        extractCognitoErrorCode(error),
        error
      );
    }

    // Check for authorization errors
    if (
      message.includes('forbidden') ||
      message.includes('authorization') ||
      message.includes('permission') ||
      message.includes('access denied')
    ) {
      return new AuthorizationError(error.message, undefined, error);
    }

    // Check for network errors
    if (
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('fetch failed') ||
      message.includes('econnrefused')
    ) {
      return new NetworkError(error.message, undefined, error);
    }

    // Check for not found errors
    if (
      message.includes('not found') ||
      message.includes('does not exist') ||
      message.includes('404')
    ) {
      return new NotFoundError(error.message, undefined, undefined, error);
    }

    // Check for GraphQL errors
    if (message.includes('graphql') || message.includes('appsync')) {
      return new GraphQLError(error.message, undefined, error);
    }

    // Default to generic DataAccessError
    return new DataAccessError(error.message, 'UNKNOWN_ERROR', error);
  }

  // If it's a string, wrap it
  if (typeof error === 'string') {
    return new DataAccessError(error, 'UNKNOWN_ERROR');
  }

  // If it's an object with a message property
  if (error && typeof error === 'object' && 'message' in error) {
    return new DataAccessError(
      String((error as { message: unknown }).message),
      'UNKNOWN_ERROR',
      error
    );
  }

  // Fallback to generic error
  return new DataAccessError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    error
  );
}

/**
 * Extract Cognito error code from error
 */
function extractCognitoErrorCode(error: Error): string | undefined {
  // Check if error has a code property
  if ('code' in error && typeof error.code === 'string') {
    return error.code;
  }

  // Check error message for common Cognito error codes
  const message = error.message;
  const cognitoCodes = [
    'NotAuthorizedException',
    'UserNotFoundException',
    'UserNotConfirmedException',
    'PasswordResetRequiredException',
    'InvalidPasswordException',
    'InvalidParameterException',
    'TooManyRequestsException',
  ];

  for (const code of cognitoCodes) {
    if (message.includes(code)) {
      return code;
    }
  }

  return undefined;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: DataAccessError): boolean {
  // Network errors are usually retryable
  if (error instanceof NetworkError) {
    return true;
  }

  // Rate limit errors are retryable after retryAfter seconds
  if (error instanceof RateLimitError) {
    return true;
  }

  // Authentication errors with expired tokens might be retryable after refresh
  if (error instanceof AuthenticationError && error.isTokenExpired()) {
    return true;
  }

  // GraphQL errors with specific codes might be retryable
  if (error instanceof GraphQLError) {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('temporary') ||
      message.includes('retry')
    );
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: DataAccessError): string {
  if (error instanceof AuthenticationError) {
    if (error.isTokenExpired()) {
      return 'Ваша сессия истекла. Пожалуйста, войдите снова.';
    }
    return 'Ошибка аутентификации. Пожалуйста, проверьте свои учетные данные.';
  }

  if (error instanceof AuthorizationError) {
    return 'У вас нет прав для выполнения этого действия.';
  }

  if (error instanceof NetworkError) {
    if (error.isConnectionError()) {
      return 'Ошибка подключения к серверу. Проверьте подключение к интернету.';
    }
    if (error.isTimeout()) {
      return 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.';
    }
    return 'Ошибка сети. Попробуйте еще раз позже.';
  }

  if (error instanceof NotFoundError) {
    return 'Запрашиваемый ресурс не найден.';
  }

  if (error instanceof ValidationError) {
    return 'Ошибка валидации данных. Проверьте введенные данные.';
  }

  if (error instanceof RateLimitError) {
    return 'Слишком много запросов. Попробуйте позже.';
  }

  if (error instanceof GraphQLError) {
    return error.getFirstError();
  }

  // Default message
  return error.message || 'Произошла ошибка. Попробуйте еще раз.';
}

