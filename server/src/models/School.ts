import { School as ISchool } from '../../../src/types';

export interface School extends ISchool {
  createdAt?: string;
}

export const validateSchool = (school: Partial<School>): string | null => {
  if (!school.id || school.id.trim().length === 0) {
    return 'School Identifier (ID) is required';
  }
  if (!school.name || school.name.trim().length === 0) {
    return 'School Name is required';
  }
  if (!school.county || school.county.trim().length === 0) {
    return 'Host County is required';
  }
  if (!school.principalName || school.principalName.trim().length === 0) {
    return 'Authorized Principal Name is required';
  }
  return null;
};
