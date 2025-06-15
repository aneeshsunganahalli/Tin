// Main types export file
// This file re-exports all types for easier importing

export * from './index';
export * from './utils';
export * from './constants';

// Type guards for runtime type checking
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidUsername = (username: string): boolean => {
  return username.length >= 2 && username.length <= 50;
};

// Type assertion helpers
export const assertIsString = (value: unknown): asserts value is string => {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
};

export const assertIsNumber = (value: unknown): asserts value is number => {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
};
