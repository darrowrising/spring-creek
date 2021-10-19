// configs
import { dateShortNoYear } from '../../../../configs/dateFormats.configs';
// utils
import { utc } from '../../../utils/date.utils';

export const tableHeaders = () => [
    {
        title: 'Devotional',
        dataIndex: 'devotional',
        key: 'devotional',
        render: (record) => record.join(', '),
    },
    {
        title: 'Activity',
        dataIndex: 'activity',
        key: 'activity',
        render: (record) => record.join(', '),
    },
    {
        title: 'Overnight',
        dataIndex: 'overnight',
        key: 'overnight',
        render: (record) => record.join(', '),
    },
    {
        title: 'Instructions',
        dataIndex: 'instructions',
        key: 'instructions',
        // render: (record) => record,
    },
    {
        title: 'Created On',
        dataIndex: 'createdDate',
        key: 'createdOn',
        render: (record) => utc(record, dateShortNoYear),
    },
];
