import Button from '../../../../components/Button';
import { utc } from '../../../../utils/date.utils';
import { dateShort } from '../../../../configs/dateFormats';
import { NotPrayed } from './styles';
import { REMOVE } from './enums';
import EditableCell from '../EditableCell';

export const columns = (onCellClick, onSave) => [
  {
    title: 'Name',
    dataIndex: 'displayName',
    key: 'displayName',
    width: '200px',
  },
  {
    title: 'Last Prayed',
    dataIndex: 'lastPrayed',
    key: 'lastPrayed',
    width: '170px',
    render: (record) => (record ? utc({ date: record, format: dateShort }) : <NotPrayed>has not prayed yet</NotPrayed>),
  },
  {
    title: 'Prayed',
    dataIndex: 'lastPrayedType',
    key: 'lastPrayedType',
    width: '170px',
  },
  {
    title: 'Notes',
    dataIndex: 'prayingNote',
    key: 'prayingNote',
    onCell: (record) => ({ onClick: () => onCellClick(record) }),
    className: 'cell editable',
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
        Delay Praying
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
      dataIndex: ['delayInPrayingReason', 'time'],
      key: 'delayInPrayingTime',
      className: 'cell',
    },
    {
      title: 'Delayed Reason',
      dataIndex: ['delayInPrayingReason', 'reason'],
      key: 'delayInPrayingReason',
      className: 'cell',
    },
  ];

  return [...regularColumns, ...newColumns, more];
};
