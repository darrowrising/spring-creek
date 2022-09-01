import { generate as uid } from 'shortid';
// configs
import { meetingTimes } from '../../configs/unit.config';
// utils
import { utc, dayjs } from '../utils/date.utils';
import { dateKey, year } from '../../configs/dateFormats.configs';

export const createProgram = (program = {}) => ({
  benediction: '',
  chorister: '',
  closing_hymn: 0,
  closing_hymn_fileName: '',
  closing_hymn_title: '',
  conducting: '',
  date: '',
  invocation: '',
  opening_hymn: 0,
  opening_hymn_fileName: '',
  opening_hymn_title: '',
  organist: '',
  presiding: '',
  program: [],
  sacrament_hymn: 0,
  sacrament_hymn_fileName: '',
  sacrament_hymn_title: '',
  topic: '',
  ...program,
  time: meetingTimes[0],
  id: dayjs(program?.date ?? '')
    .utc()
    .format(dateKey),
  year: `${utc(program?.date, year)}`,
  uid: uid(),
});

export const createTalk = ({ position = 0, speaker = '', isYouth = false } = {}) => ({
  type: 'talk',
  priority: position,
  title: `${isYouth ? 'Youth Speaker' : 'Speaker'}`,
  value: speaker,
});
