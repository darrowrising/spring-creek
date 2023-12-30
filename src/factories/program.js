import { comingSunday, utc } from '../utils/date.utils';
import { uuid } from '../utils/data.utils';
import { meetingTime, bishop } from '../configs/unit';
import { programIdShort } from '../configs/dateFormats';

export const createProgramId = () => utc({ date: comingSunday(), format: programIdShort });

export const createProgram = (program = {}, ...rest) => ({
  benediction: '',
  chorister: '',
  closing_hymn: '',
  closing_hymn_fileName: '',
  closing_hymn_title: '',
  conducting: '',
  date: '',
  invocation: '',
  opening_hymn: '',
  opening_hymn_fileName: '',
  opening_hymn_title: '',
  organist: '',
  presiding: bishop,
  program: [],
  sacrament_hymn: '',
  sacrament_hymn_fileName: '',
  sacrament_hymn_title: '',
  topic: '',
  id: createProgramId(),
  time: meetingTime,
  ...program,
  year: `${utc({ date: program?.date, format: 'YYYY' })}`,
  uid: uuid(),
  ...rest,
});

export const createTalk = ({ priority = 0, ...rest } = {}) => ({
  type: 'talk',
  priority,
  title: 'Speaker',
  uid: uuid(),
  ...rest,
});
