import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';

import { utc } from '../../../../utils/date.utils';
import { dateShort } from '../../../../../configs/dateFormats.configs';
import { NotSpoken } from './styles';
import { SET_TO_SPEAK, REMOVE } from './enums';

const { Item } = Menu;

const menu = (record) => (
  <Menu>
    <Item onClick={() => record.onClick(record, SET_TO_SPEAK)}>Set Speak Date</Item>
    <Item onClick={() => record.onClick(record, REMOVE)}>Remove From Speaking</Item>
  </Menu>
);

export const columns = [
  {
    title: 'Name',
    dataIndex: 'displayName',
    key: 'displayName',
  },
  {
    title: 'Last Spoke',
    dataIndex: 'lastSpokeInSacrament',
    key: 'lastSpokeInSacrament',
    render: (record) => (record ? utc(record, dateShort) : <NotSpoken>has not spoken yet</NotSpoken>),
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    key: 'notes',
    className: 'notes',
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
