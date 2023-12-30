import shortId from 'shortid';

import { isObject } from './object.utils';
import { utc, getMonth } from './date.utils';
import { dateSimple } from '../configs/dateFormats';

export const isEmpty = (data) => {
  if (typeof data === 'string') return !data;
  if (isObject(data)) return !Object.keys(data).length;
  return !data.length;
};

export const hasData = (data) => {
  if (!data) return false;
  if (typeof data === 'string') return !!data;
  if (isObject(data)) return !!Object.keys(data).length;
  return !!data.length;
};

export const uuid = () => shortId.generate();

export const catchify = (promise) => promise.then((result) => [null, result]).catch((error) => [error, null]);

export const handleState = (update, setState) => setState((current) => ({ ...current, ...update }));

const NUM = 'YYMMDD';
export const sortEvents = (events = []) => {
  const sortedEvents = events.sort((a, b) => {
    const aDate = a.startDate || a.endDate;
    const bDate = b.startDate || b.endDate;

    if (utc({ date: aDate, format: NUM }) > utc({ date: bDate, format: NUM })) return 1;
    if (utc({ date: aDate, format: NUM }) < utc({ date: bDate, format: NUM })) return -1;
    return 0;
  });

  return sortedEvents;
};

export const groupByDate = (events, dateKey) => {
  const KEY = dateKey || 'endDate';

  const sortedEvents = sortEvents(events).reduce((results, current) => {
    const group = getMonth(current[KEY]);
    const storage = { ...results };
    storage[group] = storage[group] || [];
    storage[group].push(current);
    return storage;
  }, {});

  return sortedEvents;
};

export const markSearchValue = (checkStr = '', value) => {
  const reg = new RegExp(value, 'i');
  const match = checkStr.match(reg);

  return (value, value !== '' && match !== null) ? checkStr.replace(match[0], `<mark>${match[0]}</mark>`) : checkStr;
};

export const search = (list, value, allowList = []) =>
  list.filter((record) => {
    const whiteListed = (item) => allowList.some((key) => key === item);
    const test = (str) => new RegExp(value.toLowerCase()).test(str.toLowerCase());
    const newRecord = Object.keys(record)
      .map((key) => (whiteListed(key) ? record[key] : null))
      .filter((item) => item);
    return newRecord.some((item) => (typeof item === 'string' ? test(item) : false));
  });

export const uniq = (arr) => [...new Set(arr.filter((item) => item))];

export const debounce = (func, delay = 300) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
