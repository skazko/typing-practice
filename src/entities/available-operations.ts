import { Operation } from './operation';
import { Role } from './role';

export const AVAILABLE_OPERATIONS = {
  [Role.ADMIN]: {
    [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
    [Role.MODERATOR]: [],
    [Role.CLIENT]: []
  },
  [Role.MODERATOR]: {
    [Role.ADMIN]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_CLIENT],
    [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
    [Role.CLIENT]: []
  },
  [Role.CLIENT]: {
    [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
    [Role.MODERATOR]: [Operation.UPDATE_TO_MODERATOR],
    [Role.CLIENT]: []
  },
} as const;
