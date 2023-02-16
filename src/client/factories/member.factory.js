import { generate as uid } from 'shortid';
import { utc } from '../utils/date.utils';

export const createMember = (member) => ({
  ageGroup: 'adult',
  email: '',
  firstName: '',
  lastName: '',
  lastPrayedInSacrament: '',
  lastSpokeInSacrament: '',
  delayInSpeaking: '',
  delayInPraying: '',
  preferredName: '',
  speakingHistory: [],
  prayerHistory: [],
  status: 'inactive',
  uid: uid(),
  createdOn: utc(),
  ...member,
});

export const createMemberName = ({ preferredName = '', firstName = '', lastName = '' }) =>
  `${preferredName || firstName} ${lastName}`;
