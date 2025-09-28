/**
 * Type definitions for utility functions
 */

export interface ErrorWithCode extends Error {
  code?: number | string;
}