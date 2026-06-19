import { memo } from 'react';
import styled from 'styled-components';
import { Form, Input } from 'antd';
import { func, number, string } from 'prop-types';

const FieldFooter = styled.div`
  margin-top: var(--space-1);
  font-size: 0.8em;
  color: var(--color-grey-1);

  ${({ $warning }) =>
    $warning &&
    `
    color: var(--color-alert);
  `}
`;

const ProgramMessageInput = memo(function ProgramMessageInput({ value = '', onChange, maxLength = 120, ...rest }) {
  const remaining = maxLength - (value?.length ?? 0);

  return (
    <>
      <Input {...rest} value={value} onChange={onChange} maxLength={maxLength} autoComplete="off" allowClear />
      <FieldFooter $warning={remaining <= 20}>
        {remaining} character{remaining === 1 ? '' : 's'} remaining
      </FieldFooter>
    </>
  );
});

ProgramMessageInput.propTypes = {
  value: string,
  onChange: func,
  maxLength: number,
};

ProgramMessageInput.defaultProps = {
  value: '',
  onChange: () => undefined,
  maxLength: 120,
};

function ProgramMessageField({ maxLength = 120 }) {
  return (
    <Form.Item label="Program Message (optional)" name="description" autoComplete="off">
      <ProgramMessageInput maxLength={maxLength} />
    </Form.Item>
  );
}

ProgramMessageField.propTypes = {
  maxLength: number,
};

ProgramMessageField.defaultProps = {
  maxLength: 120,
};

export default ProgramMessageField;
