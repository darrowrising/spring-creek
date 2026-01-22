import Button from '../../../../components/Button';
import { utc } from '../../../../utils/date.utils';
import { dateShort } from '../../../../configs/dateFormats';
import { NotSpoken } from './styles';
import { REMOVE } from './enums';
import EditableCell from '../EditableCell';

// const menu = (record) => [
//   {
//     key: '1',
//     label: <span onClick={() => record.onClick(record, REMOVE)}>Delay From Speaking</span>,
//   },
// ];

export const columns = (onCellClick, onSave) => [
  {
    title: 'Name',
    dataIndex: 'displayName',
    key: 'displayName',
    ellipsis: true,
    minWidth: 100,
  },
  {
    title: 'Last Spoke',
    dataIndex: 'lastSpoke',
    key: 'lastSpoke',
    ellipsis: true,
    minWidth: 100,
    render: (record) => (record ? utc({ date: record, format: dateShort }) : <NotSpoken>has not spoken yet</NotSpoken>),
  },
  {
    title: 'Notes',
    dataIndex: 'speakingNote',
    key: 'speakingNote',
    onCell: (record) => ({ onClick: () => onCellClick(record) }),
    className: 'cell editable',
    ellipsis: true,
    minWidth: 200,
    render: (cellValue, record) =>
      record?.showInput ? (
        <EditableCell defaultValue={cellValue} onSave={(value) => onSave(record.uid, value, 'note')} />
      ) : (
        <div style={{ padding: 'var(--space-1) 10px' }}>{cellValue}</div>
      ),
  },
  {
    title: '',
    key: 'delay',
    render: (record) => (
      <Button size="small" onClick={() => record.onClick(record, REMOVE)}>
        Delay Speaking
      </Button>
    ),
    width: '100px',
    fixed: 'right',
  },
];

export const searchColumns = (onCellClick, onSave) => {
  const regularColumns = columns(onCellClick, onSave);
  const more = regularColumns.pop();
  const newColumns = [
    {
      title: 'Delayed For',
      dataIndex: ['delayInSpeakingReason', 'time'],
      key: 'delayInSpeakingTime',
      className: 'cell',
    },
    {
      title: 'Delayed Reason',
      dataIndex: ['delayInSpeakingReason', 'reason'],
      key: 'delayInSpeakingReason',
      className: 'cell',
    },
  ];

  return [...regularColumns, ...newColumns, more];
};
