import { UserRole } from '../../../src/types';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  schoolId?: string; // e.g. 'alliance' for deans or depts
  county?: string;
  createdAt: string;
}

export const validateUser = (user: Partial<User>): string | null => {
  if (!user.email || !user.email.includes('@')) {
    return 'Invalid email address provided';
  }
  if (!user.name || user.name.trim().length === 0) {
    return 'Name is a required field';
  }
  if (!user.role) {
    return 'Role selection is required';
  }
  return null;
};
