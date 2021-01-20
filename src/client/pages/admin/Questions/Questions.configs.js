import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Tag, Menu, Dropdown } from 'antd';
import { theme } from 'theme';
// configs
import { dateTime } from '../../../../configs/dateFormats.configs';
// utils
import { markSearchValue } from '../../../utils/search.util';
import { utc } from '../../../utils/date.utils';

const { Item } = Menu;
const categories = ['youth', 'adult'];

const menu = (record) => (
    <Menu>
        <Item onClick={() => record.onClick(record, 'edit')}>Delete</Item>
    </Menu>
);

export const tableHeaders = (filters, sort, searchValue) => [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
        render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        filters: categories.length > 1 ? categories.map((item) => ({ text: item, value: item })) : null,
        filteredValue: filters.category || null,
        onFilter: (value, record) => (record?.category || []).includes(value),
        render: (record) => (
            <Tag color={theme(`color_category_${record}`)}>
                <span
                    dangerouslySetInnerHTML={{
                        __html: markSearchValue(record, searchValue),
                    }}
                />
            </Tag>
        ),
    },
    {
        title: 'Submitted Date',
        dataIndex: 'dateSubmitted',
        key: 'dateSubmitted',
        sorter: (a, b) => a.dateSubmitted.localeCompare(b.dateSubmitted),
        sortOrder: sort.columnKey === 'dateSubmitted' && sort.order,
        render: (record) => utc(record, dateTime),
    },
    {
        title: '',
        key: 'more',
        render: (record) => (
            <Dropdown className="more" overlay={menu(record)}>
                <MoreOutlined />
            </Dropdown>
        ),
        width: '50px',
    },
];
