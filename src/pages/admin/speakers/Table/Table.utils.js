import { db, docs } from '../../../../utils/firebase.utils';
import { utc, dayjs, currentYear, comingSunday, dateIdMaker } from '../../../../utils/date.utils';
import { search } from '../../../../utils/data.utils';
import { useFindMember } from '../../../../utils/organizations.utils';
import { dateShortNoYear, programIdShort, MONTHS } from '../../../../configs/dateFormats';
import { firstSacramentCollectionDate } from '../../../../configs/unit';
import { createProgram, createTalk } from '../../../../factories/program';

const searchKeyAllowList = ['Topic', 'Youth Speaker', 'Speaker', 'Testimony'];

export const searchList = (list, value) => search(list, value, searchKeyAllowList);

export const listOfYearsForTabs = () => {
  const firstYear = dayjs(firstSacramentCollectionDate).year();
  const weeksInTheYear = dayjs().week();
  const listOfYears = [firstYear];
  const getYearValue = (pastYear) => {
    if (currentYear === pastYear) return false;
    const nextYear = dayjs(`${pastYear}-01-01`).add(1, 'year').year();
    listOfYears.push(nextYear);
    getYearValue(nextYear);
  };
  getYearValue(firstYear);

  if (weeksInTheYear === 51) {
    const nextYear = dayjs().add(5, 'week').year();
    listOfYears.push(nextYear);
  }

  return listOfYears.reverse();
};

const getTheSunday = (dayOfWeek, year) =>
  dayjs(`${year}-01-01`)
    .day(dayOfWeek * 7)
    .format(dateShortNoYear);

function allSundaysInTheYear(year) {
  const sundaysInAYear = 52;
  return Array(sundaysInAYear)
    .fill()
    .map((item, index) => getTheSunday(index + 1, year));
}

const buildEmptySlots = (program = []) => {
  const newProgram = [...program].sort((a, b) => a.priority - b.priority);
  const lastPriority = newProgram.at(-1).priority + 1 ?? 1;

  for (let i = 0; i < lastPriority; i += 1) {
    const isEmpty = !newProgram.some(({ priority }) => priority === i);
    if (isEmpty) newProgram.splice(i, 0, createTalk({ priority: i }));
  }

  return newProgram;
};

function buildSpeakerList(program, members) {
  const isSpeakerType = program.some(({ type }) => type === 'talk');
  const findMember = useFindMember(members);

  if (isSpeakerType) {
    return buildEmptySlots(program)
      .filter(({ type }) => type === 'talk')
      .map(({ value, memberUid }, index) => {
        const name = findMember({ name: value, id: memberUid })?.displayName ?? value;
        return { [`speaker_${index + 1}`]: name };
      })
      .reduce((acc, cur) => ({
        ...acc,
        ...cur,
      }));
  }
  return {};
}

function handleTopic(program) {
  const isMeeting = program.program.some(({ type }) => type === 'meeting');
  let topic = program.topic; // eslint-disable-line

  if (isMeeting && !program.topic) {
    const { value } = program.program[0];

    switch (value) {
      case 'Bearing of Testimonies':
        topic = 'Fast Sunday';
        break;
      default:
        topic = value;
    }
  }

  return topic;
}

export function totalNumberOfSpeakerColumns(data) {
  let total = 0;

  data.forEach((program) => {
    const totalSpeakers = (program?.program ?? []).filter((list) => list.type === 'talk').length;
    if (totalSpeakers > total) total = totalSpeakers;
  });

  return total;
}

const makeRowClassName = (date) => {
  const monthNumber = dayjs(date, 'MMM D').month() + 1;

  if (monthNumber % 2 === 0) {
    return 'row-even';
  }
  return 'row-odd';
};

function buildSundayDate(monthDay, year) {
  const [month, day] = monthDay.split(' ');
  return `${year}-${MONTHS[month]}-${day}`;
}

export let unsubscribe = null; // eslint-disable-line

export const getSpeakers = async ({ set, year, members }) => {
  const allSundays = allSundaysInTheYear(year);

  unsubscribe = db
    .collection('program')
    .where('year', '==', `${year}`)
    .onSnapshot((snap) => {
      const programs = (docs(snap) || []).map((program) => ({
        ...program,
        ...buildSpeakerList(program.program, members),
        displayDate: utc({ date: program.date, format: dateShortNoYear }),
        topic: handleTopic(program),
      }));

      const speakers = allSundays.map((sunday) => {
        const program = programs.find((programObj) => programObj.displayDate === sunday);
        if (program) return program;
        const date = buildSundayDate(sunday, year);

        return {
          displayDate: sunday,
          date: utc({ date }),
          year: `${year}`,
          program: [],
        };
      });

      set({ speakers, loading: false });
    });
};

export const scrollToDate = (scrollAreaElement) => {
  const dateId = `date-${dateIdMaker(comingSunday.format(dateShortNoYear))}`;
  const getItemElement = () => document.getElementById(dateId);
  const options = {
    root: scrollAreaElement,
    rootMargin: '0px',
    threshold: 1.0,
  };

  const callback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;
      if (!isIntersecting) {
        getItemElement().scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  setTimeout(() => {
    observer.observe(getItemElement());
  }, 500);
};

export const handleRowClass = (record) => makeRowClassName(record.displayDate);

export const saveCell = (record) => {
  const ref = db.collection('program');
  const { uid } = record;

  if (!uid) {
    const id = utc({ date: record.date, format: programIdShort });
    const newRecord = createProgram({ ...record, id });
    ref.doc(newRecord.uid).set(newRecord);
  } else {
    ref.doc(uid).update({
      ...record,
    });
  }
};

export const saveMember = ({ uid, ...rest }) => {
  if (uid) {
    db.collection('members')
      .doc(uid)
      .update({
        uid,
        ...rest,
      });
  }
};
