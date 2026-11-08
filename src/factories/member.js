import { uuid } from '../utils/data.utils';
import { utc } from '../utils/date.utils';

export const createMember = ({ ...rest } = {}) => ({
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
  prayingNoteUpdatedAt: '',
  prayingHistory: [],
  preferredName: '',
  roles: [],
  speakingHistory: [],
  speakingNote: '',
  speakingNoteUpdatedAt: '',
  stats: {},
  status: 'inactive',
  uid: uuid(),
  year: '',
  ...rest,
});

export const createDisplayName = ({ preferredName = '', firstName = '', lastName = '' }) =>
  `${preferredName || firstName} ${lastName}`;
