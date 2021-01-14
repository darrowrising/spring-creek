import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Tag, Menu, Dropdown } from 'antd';
// components
import Status from '../../../../components/Status/Status';
// utils
import { markSearchValue } from '../../../../utils/search.util';

const menu = (record) => (
    <Menu>
        <Menu.Item onClick={() => record.onClick(record, 'edit')}>Edit</Menu.Item>
        {record?.status === 'invited' && (
            <Menu.Item onClick={() => record.onClick(record, 'resend-invite')}>Resend Invite</Menu.Item>
        )}
        {record?.status === 'active' && (
            <Menu.Item onClick={() => record.onClick(record, 'reset-password')}>Reset Password</Menu.Item>
        )}
        {
            <Menu.Item onClick={() => record.onClick(record, 'remove-from-org')}>
                {`Remove from ${record?.orgName}`}
            </Menu.Item>
        }
    </Menu>
);

export const tableHeaders = (filters, teams = [], sort, searchValue) => [
    {
        title: 'Name',
        dataIndex: 'displayName',
        key: 'displayName',
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
        dataIndex: 'activeRoles',
        key: 'activeRoles',
        render: (activeRoles) => {
            if (!activeRoles) return '';

            return (
                <span>
                    {activeRoles.map((role) => (
                        <Tag key={role?.roleUID}>{role?.roleName}</Tag>
                    ))}
                </span>
            );
        },
    },
    {
        title: 'Teams',
        dataIndex: 'activeTeams',
        key: 'activeTeams',
        filters: teams.length > 1 ? teams.map((item) => ({ text: item?.name, value: item?.uid })) : null,
        filteredValue: filters.activeTeams || null,
        onFilter: (value, record) => (record?.teams || []).includes(value),
        render: (record) => {
            if (!record) return '';
            return (
                <span>
                    {record.map((team) => (
                        <Tag key={team?.teamUID}>{team?.teamName}</Tag>
                    ))}
                </span>
            );
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
        sortOrder: sort.columnKey === 'status' && sort.order,
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
    },
];
