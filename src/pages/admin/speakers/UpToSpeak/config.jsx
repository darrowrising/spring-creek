import Button from '../../../../components/Button';
import { utc } from '../../../../utils/date.utils';
import { dateShort } from '../../../../configs/dateFormats';
import { NotSpoken, NoteCell, NoteUpdatedAt } from './styles';
import { REMOVE } from './enums';
import EditableCell from '../EditableCell';

const NOT_SPOKEN_LABEL = 'has not spoken yet';

const formatNoteUpdatedAt = (date) => (date ? `Updated ${utc({ date, format: dateShort })}` : '');

// Approximate content width so fixed-column Ant tables keep header/body aligned.
const contentWidth = (text, { min = 72, padding = 32 } = {}) =>
  Math.max(min, Math.ceil(String(text ?? '').length * 8.2) + padding);

const getLastSpokeLabel = (lastSpoke) =>
  lastSpoke ? utc({ date: lastSpoke, format: dateShort }) : NOT_SPOKEN_LABEL;

const getContentColumnWidths = (data = []) => {
  const nameWidth = contentWidth(
    data.reduce((longest, { displayName = '' }) => (displayName.length > longest.length ? displayName : longest), 'Name'),
    { min: contentWidth('Name') }
  );

  const lastSpokeWidth = contentWidth(
    data.reduce((longest, { lastSpoke }) => {
      const label = getLastSpokeLabel(lastSpoke);
      return label.length > longest.length ? label : longest;
    }, 'Last Spoke'),
    { min: contentWidth('Last Spoke') }
  );

  return { nameWidth, lastSpokeWidth };
};

export const columns = (onCellClick, onSave, data = []) => {
  const { nameWidth, lastSpokeWidth } = getContentColumnWidths(data);

  return [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      width: nameWidth,
      ellipsis: true,
    },
    {
      title: 'Last Spoke',
      dataIndex: 'lastSpoke',
      key: 'lastSpoke',
      width: lastSpokeWidth,
      ellipsis: true,
      render: (record) =>
        record ? utc({ date: record, format: dateShort }) : <NotSpoken>{NOT_SPOKEN_LABEL}</NotSpoken>,
    },
    {
      title: 'Notes',
      dataIndex: 'speakingNote',
      key: 'speakingNote',
      onCell: (record) => ({ onClick: () => onCellClick(record) }),
      className: 'cell editable',
      render: (cellValue, record) => (
        <NoteCell>
          {record?.showInput ? (
            <EditableCell defaultValue={cellValue} onSave={(value) => onSave(record.uid, value, 'note')} />
          ) : (
            <>
              {cellValue && record?.speakingNoteUpdatedAt ? (
                <NoteUpdatedAt>{formatNoteUpdatedAt(record.speakingNoteUpdatedAt)}</NoteUpdatedAt>
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
          Delay Speaking
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
