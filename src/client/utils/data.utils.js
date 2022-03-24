import { isObject } from './object.utils';

export const isEmpty = (data) => {
  if (!data) {
    console.error("I cannot see if your value is empty if you don't pass anything in");
    return false;
  }
  let value = data;

  if (isObject(value)) value = Object.keys(value);

  return value.length === 0;
};
