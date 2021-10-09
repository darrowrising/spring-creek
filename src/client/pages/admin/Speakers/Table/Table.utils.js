// configs
import { dateShortNoYear } from '../../../../../configs/dateFormats.configs';
import { firstSacramentCollectionDate } from '../../../../../configs/unit.config';
// utils
import { search } from '../../../../utils/search.util';
import { store, docs } from '../../../../utils/firebase.utils';
import { utc, dayjs, currentYear, comingSunday, dateIdMaker } from '../../../../utils/date.utils';

const searchKeyAllowList = ['Topic', 'Youth Speaker', 'Speaker', 'Testimony'];

export const searchList = (list, value) => search(list, value, searchKeyAllowList);

export const listOfYearsForTabs = () => {
    const firstYear = dayjs(firstSacramentCollectionDate).year();
    const listOfYears = [firstYear];
    const getYearValue = (pastYear) => {
        if (currentYear === pastYear) return false;
        const nextYear = dayjs(`${pastYear}-01-01`).add(1, 'year').year();
        listOfYears.push(nextYear);
        getYearValue(nextYear);
    };
    getYearValue(firstYear);

    return listOfYears.reverse();
};

// export const firstDayOfTheYearUTC = () => utc(`${dayjs().year()}-01-01`);

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

function buildSpeakerList(program) {
    const isSpeakerType = program.some(({ type }) => type === 'talk');

    if (isSpeakerType) {
        return program
            .filter(({ type }) => type === 'talk')
            .map((item, index) => ({ [`speaker_${index + 1}`]: item.value }))
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

export let unsubscribe = null; // eslint-disable-line

export const getSpeakers = async (set, year) => {
    const allSundays = allSundaysInTheYear(year);

    unsubscribe = store
        .collection('program')
        .where('year', '==', `${year}`)
        .onSnapshot((snap) => {
            const programs = (docs(snap) || []).map((program) => ({
                ...program,
                ...buildSpeakerList(program.program),
                displayDate: utc(program.date, dateShortNoYear),
                topic: handleTopic(program),
            }));
            const speakers = allSundays.map((sunday) => {
                const program = programs.find((programObj) => programObj.displayDate === sunday);
                if (program) return program;
                return {
                    displayDate: sunday,
                    uid: sunday,
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
