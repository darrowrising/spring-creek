export const isObject = (val) => {
  const obj = val === Object(val);
  const notArray = !Array.isArray(val);

  return obj && notArray;
};

/* this can be replaced with structuredClone? */
export function deepSpread(first, second) {
  const final = { ...first, ...second };

  if ([null, undefined].includes(second)) return first;

  const secondKeys = Object.keys(first);

  secondKeys.forEach((key) => {
    if (isObject(first[key]) && isObject(second[key])) {
      final[key] = deepSpread(first[key], second[key]);
    } else if (Array.isArray(first[key])) {
      final[key] = [...first[key], ...(second[key] || [])];
    } else {
      final[key] = typeof second[key] === 'boolean' ? second[key] : second[key] || first[key];
    }
  });

  return final;
}

export const groupBy = (data, key) =>
  data.reduce((results, current) => {
    const group = current[key];
    const storage = { ...results };
    storage[group] = storage[group] || [];
    storage[group].push(current);
    return storage;
  }, {});
