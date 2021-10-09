import React from 'react';
// utils
import { markSearchValue } from '../../../../utils/search.util';
import { dateIdMaker } from '../../../../utils/date.utils';

export const tableHeaders = (filters, sort, searchValue, totalSpeakers) => {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'displayDate',
            key: 'date',
            fixed: 'left',
            render: (record) => <div id={`date-${dateIdMaker(record)}`}>{record}</div>,
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
        },
    ];
    const speakerList = Array(totalSpeakers)
        .fill('')
        .map((empty, index) => ({
            title: `Speaker ${index + 1}`,
            dataIndex: `speaker_${index + 1}`,
            key: `speaker_${index + 1}`,
            render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
        }));
    return [...columns, ...speakerList];
};
