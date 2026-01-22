import { MoreOutlined } from '@ant-design/icons';
import { Tag, Dropdown } from 'antd';

import { organizations } from '../../../configs/organizations';
import { permissions } from '../../../configs/permissions';
import { dateSimple } from '../../../configs/dateFormats';
import { markSearchValue } from '../../../utils/data.utils';
import { ageGroups, callings } from '../../../configs/settings';
import { utc } from '../../../utils/date.utils';

const menu = (record) => [
  {
    key: '1',
    label: <span onClick={() => record.onClick(record, 'edit')}>Edit</span>,
  },
  {
    key: '2',
    label: <span onClick={() => record?.onClick(record, 'remove')}>Remove</span>,
  },
];

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
    title: 'Age Group',
    dataIndex: 'ageGroup',
    key: 'ageGroup',
    filters: ageGroups.length >= 1 ? ageGroups.map((item) => ({ text: item?.name, value: item?.name })) : null,
    filteredValue: filters.ageGroup || null,
    onFilter: (value, record) => (record?.ageGroup || []).includes(value),
    render: (record = 'adult') => {
      const group = (type) => ageGroups.find((item) => item.name === type);

      switch (record) {
        case 'youth': {
          const { name, color } = group('youth');
          return <strong style={{ color }}>{name}</strong>;
        }
        case 'primary': {
          const { name, color } = group('primary');
          return <span style={{ color }}>{name}</span>;
        }
        default: {
          const { name, color } = group('adult');
          return <span style={{ color }}>{name}</span>;
        }
      }
    },
  },
  {
    title: 'Organizations',
    dataIndex: 'organizations',
    key: 'organizations',
    filters: organizations.length > 1 ? organizations.map((item) => ({ text: item?.name, value: item?.name })) : null,
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
    title: 'Permissions',
    dataIndex: 'permissions',
    key: 'permissions',
    filters:
      permissions.length >= 1 ? permissions.map((permission) => ({ text: permission, value: permission })) : null,
    filteredValue: filters.permissions || null,
    onFilter: (value, record) => (record?.permissions || []).includes(value),
  },
  {
    title: 'Last Visited',
    dataIndex: 'lastVisited',
    key: 'lastVisited',
    render: (record) => (record ? utc({ date: record, format: dateSimple }) : ''),
  },
  {
    title: 'Created On',
    dataIndex: 'createdOn',
    key: 'createdOn',
    render: (record) => (record ? utc({ date: record, format: dateSimple }) : ''),
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   key: 'status',
  //   filters: statuses.map(({ name }) => ({ text: name, value: name })),
  //   filteredValue: filters.status || null,
  //   onFilter: (value, { status = [] }) => value === status,
  //   width: '150px',
  //   render: (record) => (
  //     <Status type={record} dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />
  //   ),
  // },
  {
    title: '',
    key: 'more',
    render: (record) => (
      <Dropdown className="more" menu={{ items: menu(record) }}>
        <MoreOutlined />
      </Dropdown>
    ),
    width: '50px',
    fixed: 'right',
  },
];
