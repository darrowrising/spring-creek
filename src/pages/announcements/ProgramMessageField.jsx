import { memo } from 'react';
import styled from 'styled-components';
import { Form, Input } from 'antd';
import { bool, func, number, string } from 'prop-types';

const FieldFooter = styled.div`
  margin-top: var(--space-1);
  font-size: 0.8em;
  color: var(--color-grey-1);
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  align-items: baseline;

  ${({ $warning }) =>
    $warning &&
    `
    color: var(--color-alert);
  `}
`;

const SyncButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 0.8em;
  padding: 0;
  white-space: nowrap;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

const ProgramMessageInput = memo(
  ({ value = '', onChange, maxLength = 120, onSyncFromMessage, syncLoading = false, ...rest }) => {
    const remaining = maxLength - (value?.length ?? 0);

    return (
      <>
        <Input {...rest} value={value} onChange={onChange} maxLength={maxLength} autoComplete="off" allowClear />
        <FieldFooter $warning={remaining <= 20}>
          <span>
            {remaining} character{remaining === 1 ? '' : 's'} remaining
          </span>
          {onSyncFromMessage && (
            <SyncButton type="button" onClick={onSyncFromMessage} disabled={syncLoading}>
              {syncLoading ? 'Writing with AI…' : 'Update from message'}
            </SyncButton>
          )}
        </FieldFooter>
      </>
    );
  }
);
ProgramMessageInput.displayName = 'ProgramMessageInput';

ProgramMessageInput.propTypes = {
  value: string,
  onChange: func,
  maxLength: number,
  onSyncFromMessage: func,
  syncLoading: bool,
};

ProgramMessageInput.defaultProps = {
  value: '',
  onChange: () => undefined,
  maxLength: 120,
  onSyncFromMessage: undefined,
  syncLoading: false,
};

function ProgramMessageField({ maxLength = 120, onSyncFromMessage, syncLoading = false }) {
  return (
    <Form.Item
      label="Program Message (optional)"
      name="description"
      preserve
      autoComplete="off"
      help="Short blurb for the sacrament program. Copied as-is when the website message already fits; otherwise AI shortens it — unless you edit this field yourself."
    >
      <ProgramMessageInput maxLength={maxLength} onSyncFromMessage={onSyncFromMessage} syncLoading={syncLoading} />
    </Form.Item>
  );
}

ProgramMessageField.propTypes = {
  maxLength: number,
  onSyncFromMessage: func,
  syncLoading: bool,
};

ProgramMessageField.defaultProps = {
  maxLength: 120,
  onSyncFromMessage: undefined,
  syncLoading: false,
};

export default ProgramMessageField;
