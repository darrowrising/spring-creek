import { dateIdMaker } from '../../../../utils/date.utils';
import EditableCell from '../EditableCell';
import { dateShortYear } from '../../../../configs/dateFormats';
import { utc } from '../../../../utils/date.utils';

export const tableHeaders = ({ onCellSave, onCellClick, onCellClear }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'displayDate',
      key: 'date',
      fixed: 'left',
      render: (record) => <div id={`date-${dateIdMaker(record)}`}>{record}</div>,
    },
    {
      title: 'Invocation',
      dataIndex: 'invocation',
      key: 'invocation',
      onCell: (record, rowIndex) => ({
        onClick: () => onCellClick({ record, column: 'invocation', rowIndex }),
      }),
      render: (record, rowData) =>
        rowData.showInput === 'invocation' ? (
          <EditableCell
            defaultValue={rowData.invocation}
            onSave={(value) => onCellSave({ value, column: 'invocation', rowData })}
            onRemove={() => onCellClear({ rowData })}
            type="select"
            column="members"
            defaultOpen
          />
        ) : (
          record
        ),
    },
    {
      title: 'Benediction',
      dataIndex: 'benediction',
      key: 'benediction',
      onCell: (record, rowIndex) => ({
        onClick: () => onCellClick({ record, column: 'benediction', rowIndex }),
      }),
      render: (record, rowData) =>
        rowData.showInput === 'benediction' ? (
          <EditableCell
            defaultValue={rowData.benediction}
            onSave={(value) => onCellSave({ value, column: 'benediction', rowData })}
            onRemove={() => onCellClear({ rowData })}
            type="select"
            column="members"
            defaultOpen
          />
        ) : (
          record
        ),
    },
  ];

  return [...columns];
};

export const searchColumns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    fixed: 'left',
    render: (record) => <div id={`date-${dateIdMaker(record)}`}>{utc({ date: record, format: dateShortYear })}</div>,
  },
  {
    title: 'Name',
    dataIndex: 'displayName',
    key: 'name',
  },
  {
    title: 'Prayed',
    dataIndex: 'lastPrayed',
    key: 'prayed',
  },
];
