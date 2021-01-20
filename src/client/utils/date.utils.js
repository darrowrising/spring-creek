import dayjsLib from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjsLib.extend(utcPlugin);

export function utc(date, format) {
    if (!date) return dayjsLib().utc().format();
    if (format && date) return dayjsLib.utc(date).local().format(format);

    return dayjsLib.utc(date).format();
}

export const comingSunday = dayjsLib().day(7);
export const dayjs = dayjsLib;
