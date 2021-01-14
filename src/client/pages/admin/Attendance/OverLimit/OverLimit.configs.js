import dayjs from 'dayjs';

// configs
import { dateShort } from '../../../../../configs/dateFormats.configs';

export const tableColumns = [
    {
        title: 'Family',
        dataIndex: 'name',
        key: 'family',
    },
    {
        title: 'Date When Asked Last',
        dataIndex: 'fullDate',
        key: 'date',
        render: (record) => dayjs(record.fullDate).format(dateShort),
    },
    {
        title: 'Attending',
        dataIndex: 'headcount',
        key: 'headcount',
    },
];
