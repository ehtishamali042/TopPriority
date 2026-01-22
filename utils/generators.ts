/**
 * Utility Functions
 */

/**
 * Generate unique ID with optional prefix
 */
export function generateId(prefix: string = "item"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
