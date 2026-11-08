import Button from '../../../../components/Button';
import { utc } from '../../../../utils/date.utils';
import { dateShort } from '../../../../configs/dateFormats';
import { NotPrayed, NoteCell, NoteUpdatedAt } from './styles';
import { REMOVE } from './enums';
import EditableCell from '../EditableCell';

const NOT_PRAYED_LABEL = 'has not prayed yet';

const formatNoteUpdatedAt = (date) => (date ? `Updated ${utc({ date, format: dateShort })}` : '');

// Approximate content width so fixed-column Ant tables keep header/body aligned.
const contentWidth = (text, { min = 72, padding = 32 } = {}) =>
  Math.max(min, Math.ceil(String(text ?? '').length * 8.2) + padding);

const getLastPrayedLabel = (lastPrayed) =>
  lastPrayed ? utc({ date: lastPrayed, format: dateShort }) : NOT_PRAYED_LABEL;

const longestText = (initial, values = []) =>
  values.reduce((longest, value = '') => (String(value).length > longest.length ? String(value) : longest), initial);

const getContentColumnWidths = (data = []) => {
  const nameWidth = contentWidth(longestText('Name', data.map(({ displayName }) => displayName)), {
    min: contentWidth('Name'),
  });

  const lastPrayedWidth = contentWidth(
    longestText(
      'Last Prayed',
      data.map(({ lastPrayed }) => getLastPrayedLabel(lastPrayed))
    ),
    { min: contentWidth('Last Prayed') }
  );

  const prayedWidth = contentWidth(
    longestText(
      'Prayed',
      data.map(({ lastPrayedType }) => lastPrayedType)
    ),
    { min: contentWidth('Prayed') }
  );

  return { nameWidth, lastPrayedWidth, prayedWidth };
};

export const columns = (onCellClick, onSave, data = []) => {
  const { nameWidth, lastPrayedWidth, prayedWidth } = getContentColumnWidths(data);

  return [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      width: nameWidth,
      ellipsis: true,
    },
    {
      title: 'Last Prayed',
      dataIndex: 'lastPrayed',
      key: 'lastPrayed',
      width: lastPrayedWidth,
      ellipsis: true,
      render: (record) =>
        record ? utc({ date: record, format: dateShort }) : <NotPrayed>{NOT_PRAYED_LABEL}</NotPrayed>,
    },
    {
      title: 'Prayed',
      dataIndex: 'lastPrayedType',
      key: 'lastPrayedType',
      width: prayedWidth,
      ellipsis: true,
    },
    {
      title: 'Notes',
      dataIndex: 'prayingNote',
      key: 'prayingNote',
      onCell: (record) => ({ onClick: () => onCellClick(record) }),
      className: 'cell editable',
      render: (cellValue, record) => (
        <NoteCell>
          {record?.showInput ? (
            <EditableCell defaultValue={cellValue} onSave={(value) => onSave(record.uid, value, 'note')} />
          ) : (
            <>
              {cellValue && record?.prayingNoteUpdatedAt ? (
                <NoteUpdatedAt>{formatNoteUpdatedAt(record.prayingNoteUpdatedAt)}</NoteUpdatedAt>
              ) : null}
              {cellValue}
            </>
          )}
        </NoteCell>
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
};

export const searchColumns = (onCellClick, onSave, data = []) => {
  const regularColumns = columns(onCellClick, onSave, data);
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
