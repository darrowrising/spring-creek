import { generate as uid } from 'shortid';
import { utc } from '../utils/date.utils';

export const createMember = (member) => ({
  ageGroup: 'adult',
  email: '',
  firstName: '',
  lastName: '',
  lastPrayedInSacrament: '',
  lastSpokeInSacrament: '',
  preferredName: '',
  speakingHistory: [],
  prayerHistory: [],
  ...member,
  status: 'inactive',
  uid: uid(),
  createdOn: utc(),
});

export const createMemberName = ({ preferredName = '', firstName = '', lastName = '' }) =>
  `${preferredName || firstName} ${lastName}`;
