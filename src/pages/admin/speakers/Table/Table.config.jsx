import { dateIdMaker } from '../../../../utils/date.utils';
import EditableCell from '../EditableCell';

export const tableHeaders = ({ totalSpeakers, onCellSave, onCellClick, onCellClear }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'displayDate',
      key: 'date',
      fixed: 'left',
      render: (record) => <div id={`date-${dateIdMaker(record)}`}>{record}</div>,
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      // render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
      onCell: (record, rowIndex, rowData) => ({
        onClick: () => onCellClick({ record, column: 'topic', rowIndex, rowData }),
      }),
      className: 'cell editable',
      render: (record, rowData) => {
        return rowData.showInput === 0 ? (
          <EditableCell
            defaultValue={record}
            onSave={(value = '') => onCellSave({ value, column: 'topic', rowData })}
            type="select"
            column="topic"
            defaultOpen
            onRemove={() => onCellClear({ rowData, column: 'topic' })}
          />
        ) : (
          <span data-testid="topic-cell">{record}</span>
        );
      },
    },
  ];

  const speakerList = Array(totalSpeakers + 1)
    .fill('')
    .map((empty, index) => ({
      title: `Speaker ${index + 1}`,
      dataIndex: `speaker_${index + 1}`,
      key: `speaker_${index + 1}`,
      // render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
      onCell: (record, rowIndex) => ({
        onClick: () => onCellClick({ record, index, column: 'speaker', rowIndex }),
      }),
      className: 'cell editable',
      render: (record, rowData) => {
        return rowData.showInput === index + 1 ? (
          <EditableCell
            defaultValue={rowData[`speaker_${index + 1}`]}
            onSave={(value) => onCellSave({ value, column: 'speaker', index, rowData })}
            onRemove={() => onCellClear({ index, rowData })}
            type="select"
            column="members"
            defaultOpen
          />
        ) : (
          record
        );
      },
    }));

  return [...columns, ...speakerList];
};
