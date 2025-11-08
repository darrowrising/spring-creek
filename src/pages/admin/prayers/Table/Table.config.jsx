import { dateIdMaker } from '../../../../utils/date.utils';
import EditableCell from '../EditableCell';

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
