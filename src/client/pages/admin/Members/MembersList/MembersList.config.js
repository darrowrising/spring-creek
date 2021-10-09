import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Tag, Menu, Dropdown } from 'antd';
// components
import Status from '../../../../components/Status/Status';
// configs
import { organizations } from '../../../../../configs/organizations.configs';
import { dateSimple } from '../../../../../configs/dateFormats.configs';
import { roles } from '../../../../../configs/roles.configs';
import { callings } from '../../../../../configs/callings.configs';
import { statuses } from '../../../../../configs/members.config';
// utils
import { markSearchValue } from '../../../../utils/search.util';
import { utc } from '../../../../utils/date.utils';

const { Item } = Menu;

const menu = (record) => (
    <Menu>
        <Item onClick={() => record.onClick(record, 'edit')}>Edit</Item>
        <Item onClick={() => record.onClick(record, 'combine')}>Combine Records</Item>
        {record?.status !== 'deactivated' && (
            <Item onClick={() => record.onClick(record, 'deactivate')}>Deactivate</Item>
        )}
    </Menu>
);

export const tableHeaders = (filters, sort, searchValue) => [
    {
        title: 'Name',
        dataIndex: 'displayName',
        key: 'displayName',
        fixed: 'left',
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
        sortOrder: sort.columnKey === 'displayName' && sort.order,
        render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sort.columnKey === 'email' && sort.order,
        render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
    },
    {
        title: 'Roles',
        dataIndex: 'roles',
        key: 'roles',
        filters: roles.length >= 1 ? roles.map((item) => ({ text: item?.name, value: item?.name })) : null,
        filteredValue: filters.roles || null,
        onFilter: (value, record) => (record?.roles || []).includes(value),
    },
    {
        title: 'Organizations',
        dataIndex: 'organizations',
        key: 'organizations',
        filters:
            organizations.length > 1 ? organizations.map((item) => ({ text: item?.name, value: item?.name })) : null,
        filteredValue: filters.organizations || null,
        onFilter: (value, record) => (record?.organizations || []).includes(value),
        render: (record) => {
            if (!record) return '';
            const orgs = record.map((org) => organizations.find((item) => item.name === org));

            return (
                <span>
                    {orgs.map((org) => (
                        <Tag key={org?.uid} color={org.color}>
                            {org?.name}
                        </Tag>
                    ))}
                </span>
            );
        },
    },
    {
        title: 'Callings',
        dataIndex: 'callings',
        key: 'callings',
        filters: callings.length >= 1 ? callings.map((item) => ({ text: item?.name, value: item?.name })) : null,
        filteredValue: filters.callings || null,
        onFilter: (value, record) => (record?.callings || []).includes(value),
    },
    {
        title: 'Last Visted',
        dataIndex: 'lastVisited',
        key: 'lastVisited',
        render: (record) => (record ? utc(record, dateSimple) : ''),
    },
    {
        title: 'Created On',
        dataIndex: 'createdOn',
        key: 'createdOn',
        render: (record) => (record ? utc(record, dateSimple) : ''),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: statuses.map(({ name }) => ({ text: name, value: name })),
        filteredValue: filters.status || null,
        onFilter: (value, { status = [] }) => value === status,
        width: '150px',
        render: (record) => (
            <Status type={record} dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />
        ),
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
        fixed: 'right',
    },
];
