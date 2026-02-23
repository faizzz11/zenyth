/**
 * Startup validation for meme-agent feature
 * Validates environment and dependencies before the app starts
 */

import { validateEnvironment, logEnvironmentStatus } from '@/lib/envValidation';

export interface StartupValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Perform all startup validations
 */
export function performStartupValidation(): StartupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate environment variables
  const envResult = validateEnvironment();
  if (!envResult.isValid) {
    errors.push(...envResult.errors);
  }

  // Check for FFmpeg (optional for video generation)
  if (typeof window === 'undefined') {
    // Server-side check
    try {
      const { execSync } = require('child_process');
      execSync('ffmpeg -version', { stdio: 'ignore' });
    } catch (error) {
      warnings.push(
        'FFmpeg is not installed. Video generation will not be available. ' +
        'Install FFmpeg to enable video features.'
      );
    }
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log startup validation results
 */
export function logStartupValidation(): void {
  console.log('\n=== Meme Agent Startup Validation ===\n');
  
  const result = performStartupValidation();
  
  // Log environment status
  logEnvironmentStatus();
  
  // Log warnings
  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    result.warnings.forEach((warning) => {
      console.warn(`  ⚠ ${warning}`);
    });
  }
  
  // Log errors
  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach((error) => {
      console.error(`  ✗ ${error}`);
    });
    console.log('\nPlease fix the errors above before starting the application.\n');
  } else {
    console.log('\n✓ Startup validation passed\n');
  }
}

/**
 * Validate and throw if errors exist
 */
export function validateOrThrow(): void {
  const result = performStartupValidation();
  
  if (!result.success) {
    throw new Error(
      'Startup validation failed:\n' +
      result.errors.join('\n') +
      '\n\nPlease check your environment configuration.'
    );
  }
}
