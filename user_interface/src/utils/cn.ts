import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with conditional logic
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}