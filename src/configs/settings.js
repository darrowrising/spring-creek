import { colorOrgWard, colorOrgYouth, colorOrgPrimary } from '../styles/variables';

export const ageGroups = [
  {
    name: 'adult',
    color: colorOrgWard,
    uid: 'ageGroup1',
  },
  {
    name: 'youth',
    color: colorOrgYouth,
    uid: 'ageGroup2',
  },
  {
    name: 'primary',
    color: colorOrgPrimary,
    uid: 'ageGroup3',
  },
];

export const roles = [
  {
    name: 'role:ultron',
    description: 'Master Admin',
  },
];

export const statuses = [
  {
    name: 'Active',
    def: 'Created account and is approved',
  },
  {
    name: 'Pending',
    def: 'Logged in, waiting to be approved',
  },
  {
    name: 'Inactive',
    def: 'Has not created an account',
  },
  {
    name: 'Deactivated',
    def: 'Account is shutdown and has been removed from the site.',
  },
];

export const callings = [
  {
    name: 'Ward Clerk',
    uid: 'call1',
  },
];
