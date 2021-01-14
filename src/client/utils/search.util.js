export const markSearchValue = (checkStr = '', value) => {
    const reg = new RegExp(value, 'i');
    const match = checkStr.match(reg);

    return (value, value !== '' && match !== null) ? checkStr.replace(match[0], `<mark>${match[0]}</mark>`) : checkStr;
};

export const search = (list, value, allowList) =>
    list.filter((record) => {
        const checkedWhiteList = allowList || [];
        const whiteListed = (item) => checkedWhiteList.some((key) => key === item);
        const test = (str) => new RegExp(value.toLowerCase()).test(str.toLowerCase());
        const newRecord = Object.keys(record)
            .map((key) => (whiteListed(key) ? record[key] : null))
            .filter((item) => item);

        return newRecord.some((item) => (typeof item === 'string' ? test(item) : false));
    });
