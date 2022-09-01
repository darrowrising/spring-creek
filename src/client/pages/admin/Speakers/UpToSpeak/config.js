import React from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';

import EditableCell from '../EditableCell';
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

export const columns = (onCellClick, onSave) => [
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
    dataIndex: 'speakingNote',
    key: 'speakingNote',
    onCell: (record) => ({ onClick: () => onCellClick(record) }),
    className: 'cell editable',
    render: (record) =>
      record?.showInput ? (
        <EditableCell
          defaultValue={record.speakingNote}
          onSave={({ target: { value } }) => onSave(record.uid, value, 'note')}
        />
      ) : (
        record
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

export const searchColumns = (onCellClick, onSave) => [
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
    dataIndex: 'speakingNote',
    key: 'speakingNote',
    className: 'cell editable',
    onCell: (record) => ({ onClick: () => onCellClick(record) }),
    render: (record) =>
      record?.showInput ? (
        <EditableCell
          defaultValue={record.speakingNote}
          onSave={({ target: { value } }) => onSave(record.uid, value, 'note')}
        />
      ) : (
        record
      ),
  },
  {
    title: 'Removed From Schedule For',
    dataIndex: ['delayInSpeakingReason', 'time'],
    key: 'delayInSpeakingTime',
    className: 'cell',
  },
  {
    title: 'Removed Reason',
    dataIndex: ['delayInSpeakingReason', 'reason'],
    key: 'delayInSpeakingReason',
    className: 'cell',
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
