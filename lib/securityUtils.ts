/**
 * Security utilities for protecting sensitive information
 * Prevents API keys and secrets from being exposed in logs, errors, and responses
 */

/**
 * Patterns that might contain API keys or secrets
 */
const SENSITIVE_PATTERNS = [
  /GEMINI_API_KEY/gi,
  /MONGODB_URI/gi,
  /mongodb:\/\/[^@]+@/gi, // MongoDB connection strings with credentials
  /mongodb\+srv:\/\/[^@]+@/gi,
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, // Bearer tokens
  /api[_-]?key["\s:=]+[A-Za-z0-9\-._~+/]+=*/gi, // API key patterns
  /secret["\s:=]+[A-Za-z0-9\-._~+/]+=*/gi, // Secret patterns
  /password["\s:=]+[^\s"]+/gi, // Password patterns
  /token["\s:=]+[A-Za-z0-9\-._~+/]+=*/gi, // Token patterns
];

/**
 * Sanitize a string by removing or masking sensitive information
 */
export function sanitizeString(input: string): string {
  let sanitized = input;
  
  // Replace sensitive patterns with masked versions
  SENSITIVE_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, (match) => {
      // Keep the first few characters for context, mask the rest
      if (match.length <= 8) {
        return '[REDACTED]';
      }
      const prefix = match.substring(0, 4);
      return `${prefix}...[REDACTED]`;
    });
  });
  
  return sanitized;
}

/**
 * Sanitize an error object
 */
export function sanitizeError(error: Error): Error {
  const sanitizedError = new Error(sanitizeString(error.message));
  sanitizedError.name = error.name;
  sanitizedError.stack = error.stack ? sanitizeString(error.stack) : undefined;
  return sanitizedError;
}

/**
 * Sanitize an object (recursively)
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj) as T;
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Completely remove sensitive keys
      if (isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Check if a key name is sensitive
 */
function isSensitiveKey(key: string): boolean {
  const sensitiveKeys = [
    'apikey',
    'api_key',
    'apiKey',
    'secret',
    'password',
    'token',
    'auth',
    'authorization',
    'credentials',
    'mongodb_uri',
    'mongodbUri',
  ];
  
  const lowerKey = key.toLowerCase();
  return sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive));
}

/**
 * Safe console.log that sanitizes output
 */
export function safeLog(...args: any[]): void {
  const sanitized = args.map((arg) => {
    if (typeof arg === 'string') {
      return sanitizeString(arg);
    }
    if (typeof arg === 'object') {
      return sanitizeObject(arg);
    }
    return arg;
  });
  console.log(...sanitized);
}

/**
 * Safe console.error that sanitizes output
 */
export function safeError(...args: any[]): void {
  const sanitized = args.map((arg) => {
    if (arg instanceof Error) {
      return sanitizeError(arg);
    }
    if (typeof arg === 'string') {
      return sanitizeString(arg);
    }
    if (typeof arg === 'object') {
      return sanitizeObject(arg);
    }
    return arg;
  });
  console.error(...sanitized);
}

/**
 * Sanitize API response before sending to client
 */
export function sanitizeApiResponse<T>(response: T): T {
  return sanitizeObject(response);
}

/**
 * Validate that a string doesn't contain sensitive information
 */
export function containsSensitiveInfo(input: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Mask an API key for display (show first 4 and last 4 characters)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return '[REDACTED]';
  }
  
  const first = apiKey.substring(0, 4);
  const last = apiKey.substring(apiKey.length - 4);
  const masked = '*'.repeat(Math.min(apiKey.length - 8, 20));
  
  return `${first}${masked}${last}`;
}

/**
 * Create a safe error message for client display
 */
export function createSafeErrorMessage(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;
  const sanitized = sanitizeString(message);
  
  // Remove technical details that might leak information
  const cleaned = sanitized
    .replace(/at\s+.*\(.*\)/g, '') // Remove stack trace lines
    .replace(/\/[^\s]+\//g, '') // Remove file paths
    .trim();
  
  return cleaned || 'An error occurred';
}

/**
 * Audit a log message before logging
 */
export function auditLogMessage(message: string): {
  safe: boolean;
  sanitized: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (containsSensitiveInfo(message)) {
    warnings.push('Message contains sensitive information');
  }
  
  const sanitized = sanitizeString(message);
  
  return {
    safe: warnings.length === 0,
    sanitized,
    warnings,
  };
}
