export interface AppError {
  code: string;
  message: string;
  status?: number;
  details?: any;
}

export function parseApiError(error: any): AppError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  // Network / Offline / Timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT',
      message: 'The request took too long. Please check your connection and try again.',
    };
  }

  if (!error.response && error.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the LipTalk server. Please verify your internet connection.',
    };
  }

  const status = error.response?.status;
  const backendMsg = error.response?.data?.message;

  const displayMessage = Array.isArray(backendMsg)
    ? backendMsg.join(', ')
    : typeof backendMsg === 'string'
    ? backendMsg
    : null;

  switch (status) {
    case 400:
      return {
        code: 'BAD_REQUEST',
        status,
        message: displayMessage || 'The request was invalid. Please check your inputs.',
      };
    case 401:
      return {
        code: 'UNAUTHORIZED',
        status,
        message: 'Your session has expired. Please sign in again.',
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        status,
        message: displayMessage || 'You do not have permission to perform this action.',
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        status,
        message: displayMessage || 'The requested resource could not be found.',
      };
    case 409:
      return {
        code: 'CONFLICT',
        status,
        message: displayMessage || 'A conflict occurred with an existing record.',
      };
    case 422:
      return {
        code: 'UNPROCESSABLE_ENTITY',
        status,
        message: displayMessage || 'Unable to process the submitted data.',
      };
    case 429:
      return {
        code: 'RATE_LIMITED',
        status,
        message: 'Too many requests. Please slow down and try again shortly.',
      };
    case 500:
    case 502:
    case 503:
      return {
        code: 'SERVER_ERROR',
        status,
        message: 'LipTalk services are momentarily experiencing issues. Please try again soon.',
      };
    default:
      return {
        code: 'HTTP_ERROR',
        status: status || 500,
        message: displayMessage || 'Something went wrong. Please try again.',
      };
  }
}
