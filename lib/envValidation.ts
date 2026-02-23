/**
 * Environment variable validation utility
 * Validates required environment variables at application startup
 */

export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  errors: string[];
}

/**
 * Required environment variables for the meme-agent feature
 */
const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY',
  'MONGODB_URI',
] as const;

/**
 * Optional environment variables with defaults
 */
const OPTIONAL_ENV_VARS = {
  MONGODB_DB_NAME: 'zenythh',
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
} as const;

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): EnvValidationResult {
  const missingVars: string[] = [];
  const errors: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    
    if (!value) {
      missingVars.push(varName);
      errors.push(`${varName} is not set`);
    } else if (value.trim() === '') {
      missingVars.push(varName);
      errors.push(`${varName} is empty`);
    }
  }

  // Validate MongoDB URI format
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && !mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    errors.push('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  return {
    isValid: missingVars.length === 0 && errors.length === 0,
    missingVars,
    errors,
  };
}

/**
 * Validate environment and throw error if invalid
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  
  if (!result.isValid) {
    const errorMessage = [
      'Environment validation failed:',
      ...result.errors,
      '',
      'Please ensure all required environment variables are set in your .env.local file.',
      'See .env.example for reference.',
    ].join('\n');
    
    throw new Error(errorMessage);
  }
}

/**
 * Get environment variable with validation
 */
export function getRequiredEnv(varName: string): string {
  const value = process.env[varName];
  
  if (!value) {
    throw new Error(
      `Environment variable ${varName} is required but not set. ` +
      'Please check your .env.local file.'
    );
  }
  
  return value;
}

/**
 * Get optional environment variable with default
 */
export function getOptionalEnv(varName: string, defaultValue: string): string {
  return process.env[varName] || defaultValue;
}

/**
 * Log environment validation status (safe - no secrets)
 */
export function logEnvironmentStatus(): void {
  const result = validateEnvironment();
  
  if (result.isValid) {
    console.log('✓ Environment validation passed');
    console.log('  All required environment variables are set');
  } else {
    console.error('✗ Environment validation failed');
    result.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
  }
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get safe environment info for logging (no secrets)
 */
export function getSafeEnvInfo(): Record<string, string> {
  return {
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    MONGODB_URI_SET: process.env.MONGODB_URI ? 'yes' : 'no',
    GEMINI_API_KEY_SET: process.env.GEMINI_API_KEY ? 'yes' : 'no',
  };
}
