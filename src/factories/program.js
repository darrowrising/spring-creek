import { comingSunday, utc } from '../utils/date.utils';
import { uuid } from '../utils/data.utils';
import { meetingTime, bishop } from '../configs/unit';
import { programIdShort } from '../configs/dateFormats';

export const createProgramId = () => utc({ date: comingSunday(), format: programIdShort });

export const createProgram = (program = {}, ...rest) => ({
  benediction: program.benediction ?? '',
  chorister: program.chorister ?? '',
  closing_hymn: program.closing_hymn ?? '',
  closing_hymn_extra: program.closing_hymn_extra ?? '',
  closing_hymn_title: program.closing_hymn_title ?? '',
  conducting: program.conducting ?? '',
  date: program.date ?? '',
  invocation: program.invocation ?? '',
  note: program.note ?? '',
  print_layout: program.print_layout ?? 'events',
  opening_hymn: program.opening_hymn ?? '',
  opening_hymn_extra: program.opening_hymn_extra ?? '',
  opening_hymn_title: program.opening_hymn_title ?? '',
  organist: program.organist ?? '',
  presiding: program.presiding ?? bishop,
  program: program.program ?? [],
  sacrament_hymn: program.sacrament_hymn ?? '',
  sacrament_hymn_extra: program.sacrament_hymn_extra ?? '',
  sacrament_hymn_title: program.sacrament_hymn_title ?? '',
  topic: program.topic ?? '',
  id: program.id ?? createProgramId(),
  time: program.time ?? meetingTime,
  year: program.year ?? `${utc({ date: program?.date, format: 'YYYY' })}`,
  uid: program.uid ?? uuid(),
  ...rest,
});

export const createTalk = ({ priority = 0, ...rest } = {}) => ({
  type: 'talk',
  priority,
  title: 'Speaker',
  uid: uuid(),
  ...rest,
});
