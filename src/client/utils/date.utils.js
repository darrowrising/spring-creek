import dayjsLib from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjsLib.extend(utcPlugin);

export const dayjs = dayjsLib;
