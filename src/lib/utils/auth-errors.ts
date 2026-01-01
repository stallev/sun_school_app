/**
 * AWS Cognito error handling utilities
 * Maps Cognito error codes to user-friendly messages in Russian
 */

/**
 * Cognito error types
 */
export type CognitoErrorName =
  | 'NotAuthorizedException'
  | 'UserNotFoundException'
  | 'UserNotConfirmedException'
  | 'PasswordResetRequiredException'
  | 'UserLambdaValidationException'
  | 'TooManyRequestsException'
  | 'LimitExceededException'
  | 'InvalidParameterException'
  | 'InvalidPasswordException'
  | 'UsernameExistsException'
  | 'CodeMismatchException'
  | 'ExpiredCodeException'
  | 'AliasExistsException'
  | 'InvalidUserPoolConfigurationException'
  | 'NetworkError'
  | 'UnknownError';

/**
 * Get user-friendly error message from Cognito error
 * @param error - Error object from Cognito
 * @returns User-friendly error message in Russian
 */
export function getCognitoErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Произошла неизвестная ошибка. Попробуйте еще раз.';
  }

  // Check if error has a name property (Cognito errors usually have this)
  if ('name' in error) {
    const errorName = error.name as CognitoErrorName;
    return getErrorMessageByCode(errorName);
  }

  // Check if error has a message property
  if ('message' in error) {
    const errorMessage = String(error.message);
    
    // Try to match common error patterns
    if (errorMessage.includes('NotAuthorizedException')) {
      return getErrorMessageByCode('NotAuthorizedException');
    }
    if (errorMessage.includes('UserNotFoundException')) {
      return getErrorMessageByCode('UserNotFoundException');
    }
    if (errorMessage.includes('UserNotConfirmedException')) {
      return getErrorMessageByCode('UserNotConfirmedException');
    }
    if (errorMessage.includes('PasswordResetRequiredException')) {
      return getErrorMessageByCode('PasswordResetRequiredException');
    }
    if (errorMessage.includes('TooManyRequestsException')) {
      return getErrorMessageByCode('TooManyRequestsException');
    }
    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return getErrorMessageByCode('NetworkError');
    }
  }

  // Default error message
  return getErrorMessageByCode('UnknownError');
}

/**
 * Get error message by Cognito error code
 * @param errorCode - Cognito error code
 * @returns User-friendly error message in Russian
 */
function getErrorMessageByCode(errorCode: CognitoErrorName): string {
  const errorMessages: Record<CognitoErrorName, string> = {
    NotAuthorizedException: 'Неверный email или пароль. Проверьте правильность введенных данных.',
    UserNotFoundException: 'Пользователь с таким email не найден. Проверьте правильность email адреса.',
    UserNotConfirmedException: 'Пользователь не подтвержден. Проверьте email для подтверждения учетной записи.',
    PasswordResetRequiredException: 'Требуется сброс пароля. Обратитесь к администратору для восстановления доступа.',
    UserLambdaValidationException: 'Ошибка валидации данных. Попробуйте еще раз или обратитесь к администратору.',
    TooManyRequestsException: 'Слишком много попыток входа. Подождите несколько минут и попробуйте снова.',
    LimitExceededException: 'Превышен лимит попыток. Подождите несколько минут и попробуйте снова.',
    InvalidParameterException: 'Некорректные данные. Проверьте правильность введенных данных.',
    InvalidPasswordException: 'Пароль не соответствует требованиям безопасности.',
    UsernameExistsException: 'Пользователь с таким email уже существует.',
    CodeMismatchException: 'Неверный код подтверждения. Проверьте правильность введенного кода.',
    ExpiredCodeException: 'Код подтверждения истек. Запросите новый код.',
    AliasExistsException: 'Email адрес уже используется другим пользователем.',
    InvalidUserPoolConfigurationException: 'Ошибка конфигурации системы. Обратитесь к администратору.',
    NetworkError: 'Ошибка подключения. Проверьте интернет-соединение и попробуйте еще раз.',
    UnknownError: 'Произошла неизвестная ошибка. Попробуйте еще раз или обратитесь к администратору.',
  };

  return errorMessages[errorCode] || errorMessages.UnknownError;
}

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns true if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  if ('name' in error && error.name === 'NetworkError') {
    return true;
  }

  if ('message' in error) {
    const message = String(error.message);
    return message.includes('Network') || message.includes('fetch') || message.includes('Failed to fetch');
  }

  return false;
}

/**
 * Check if error is a rate limit error
 * @param error - Error object
 * @returns true if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  if ('name' in error) {
    const errorName = error.name as string;
    return errorName === 'TooManyRequestsException' || errorName === 'LimitExceededException';
  }

  if ('message' in error) {
    const message = String(error.message);
    return message.includes('TooManyRequests') || message.includes('LimitExceeded');
  }

  return false;
}

