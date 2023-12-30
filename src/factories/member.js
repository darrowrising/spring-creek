import { uuid } from '../utils/data.utils';
import { utc } from '../utils/date.utils';

export const createMember = ({ ...rest } = {}) => ({
  ageGroup: 'adult',
  callings: [],
  createdOn: utc(),
  delayInPraying: '',
  delayInPrayingReason: {},
  delayInSpeaking: '',
  delayInSpeakingReason: {},
  email: '',
  firstName: '',
  lastName: '',
  lastVisited: '',
  organizations: [],
  prayingNote: '',
  prayingHistory: [],
  preferredName: '',
  roles: [],
  speakingHistory: [],
  speakingNote: '',
  stats: {},
  status: 'inactive',
  uid: uuid(),
  year: '',
  ...rest,
});

export const createDisplayName = ({ preferredName = '', firstName = '', lastName = '' }) =>
  `${preferredName || firstName} ${lastName}`;
