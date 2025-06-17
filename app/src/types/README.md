# Types Directory

This directory contains all TypeScript type definitions for the project, organized for better maintainability and developer experience.

## File Structure

### `index.d.ts`
Main type definitions file containing:
- Global Express interface extensions
- Core interfaces (API responses, request bodies, etc.)
- Environment configuration types
- Database and authentication related types

### `utils.d.ts`
Utility types including:
- Transformed user types (safe responses, partial updates)
- Generic request handler types
- Middleware function types
- Paginated response types

### `constants.ts`
Application constants and enums:
- HTTP status codes
- Error and success messages
- Configuration constants
- Validation rules
- Enums for user roles, environments, etc.

### `types.ts`
Main export file and type guards:
- Re-exports all types for easy importing
- Runtime type checking functions
- Type assertion helpers

## Usage Examples

### Importing Types
```typescript
// Import specific types
import { AuthResponse, RegisterRequest } from '../types';

// Import constants
import { HTTP_STATUS, ERROR_MESSAGES } from '../types/constants';

// Import all types
import * from '../types/types';
```

### Using Request Handler Types
```typescript
import { AsyncRequestHandler, RegisterRequest, AuthResponse } from '../types';

const registerUser: AsyncRequestHandler<RegisterRequest, AuthResponse> = async (req, res) => {
  // TypeScript will provide full type checking for req.body and res.json()
};
```

### Using Constants
```typescript
import { HTTP_STATUS, ERROR_MESSAGES } from '../types/constants';

res.status(HTTP_STATUS.BAD_REQUEST).json({
  success: false,
  message: ERROR_MESSAGES.REQUIRED_FIELDS
});
```

## Benefits

1. **Type Safety**: Full TypeScript support with compile-time error checking
2. **IntelliSense**: Better IDE support with autocomplete and type hints
3. **Consistency**: Standardized response formats and error handling
4. **Maintainability**: Centralized type definitions make changes easier
5. **Documentation**: Types serve as living documentation for the API
6. **Refactoring**: Safe refactoring with TypeScript's type checking

## Path Mapping

The `tsconfig.json` includes path mapping for easier imports:
- `@/*` maps to `src/*`
- `@/types/*` maps to `src/types/*`
- Similar mappings for other directories

This allows for cleaner imports like:
```typescript
import { AuthResponse } from '@/types';
import User from '@/models/userModel';
```
