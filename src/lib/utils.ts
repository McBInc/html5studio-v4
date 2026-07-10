import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Cinematic Utility (V82)
 * Grafted from V5 to V4.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
