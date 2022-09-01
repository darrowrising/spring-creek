import React from 'react';
// components
import EditableCell from '../EditableCell';
// utils
import { markSearchValue } from '../../../../utils/search.util';
import { dateIdMaker } from '../../../../utils/date.utils';

export const tableHeaders = (searchValue, totalSpeakers, onCellSave, onCellClick, onCellClear) => {
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
      onCell: (record, rowIndex) => ({ onClick: () => onCellClick(record, 'topic', rowIndex) }),
      className: 'cell editable',
      render: (record) =>
        record?.showInput ? (
          <EditableCell
            defaultValue={record.topic}
            onSave={(value) => onCellSave(record, value, 'topic')}
            type="select"
            column="topic"
            defaultOpen
          />
        ) : (
          record
        ),
    },
  ];
  /* eslint-disable */
  const speakerList = Array(totalSpeakers + 1)
    .fill('')
    .map((empty, index) => ({
      title: `Speaker ${index + 1}`,
      dataIndex: `speaker_${index + 1}`,
      key: `speaker_${index + 1}`,
      // render: (record) => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />,
      onCell: (record, rowIndex) => ({ onClick: () => onCellClick(record, `speaker_${index + 1}`, rowIndex) }),
      className: 'cell editable',
      render: (record, rowData, rowIndex) => {
        return record?.showInput ? (
          <EditableCell
            defaultValue={record.value}
            onSave={(value) => onCellSave(record, value, `speaker_${index + 1}`, rowIndex)}
            onRemove={() => onCellClear(record, index, rowIndex)}
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
