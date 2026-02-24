import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Get the current authenticated user's ID
 * Returns null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Get the current authenticated user's full details
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
}

/**
 * Get user ID or return demo user for development
 */
export async function getUserIdOrDemo(): Promise<string> {
  const userId = await getCurrentUserId();
  return userId || 'demo-user';
}
