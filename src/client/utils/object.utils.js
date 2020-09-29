export const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);

export function deepSpread(first, second) {
    const final = { ...first, ...second };

    if ([null, undefined].includes(second)) return first;

    const secondKeys = Object.keys(first);

    secondKeys.forEach((key) => {
        if (isObject(first[key]) && isObject(second[key])) {
            final[key] = deepSpread(first[key], second[key]);
        } else {
            final[key] = typeof second[key] === 'boolean' ? second[key] : second[key] || first[key];
        }
    });

    return final;
}
