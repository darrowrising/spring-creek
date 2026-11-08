import { useEffect, useRef, useState } from 'react';
import { func, string } from 'prop-types';
import { Input, Select } from 'antd';
import styled from 'styled-components';

import { useAdminContext } from '../../../../providers/admin.provider';
import { TOPIC_SELECT } from '../enums';

const { TextArea } = Input;
const { Option } = Select;

const Wrapper = styled.div`
  min-width: 200px;

  & > * {
    width: 100%;
  }

  & > span {
    background-color: var(--color-bg-select-transparent) !important;
    border: none;
    outline: none;
    box-shadow: none;

    &:focus-within {
      outline: none !important;
      box-shadow: none;
    }
  }
`;

const NoteInputWrapper = styled.div`
  width: 100%;

  .ant-input-textarea-affix-wrapper,
  .ant-input-affix-wrapper {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--color-grey-3, #d9d9d9);
    border-radius: 6px;
    background: #fff;
    box-shadow: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover,
    &:focus-within {
      border-color: #d99e36;
      box-shadow: 0 0 0 2px #d99e3621;
    }
  }

  .ant-input-textarea-affix-wrapper-focused,
  .ant-input-affix-wrapper-focused {
    border-color: #d99e36;
    box-shadow: 0 0 0 2px #d99e3621;
  }

  .ant-input,
  textarea.ant-input {
    width: 100%;
    margin: 0;
    padding: 0 22px 0 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    resize: none;
    line-height: 1.4;
    /* Match table text; override global mobile 16px/36px input rules */
    font-size: 13px !important;
    height: auto !important;
    min-height: 0 !important;
    color: inherit;
  }

  .ant-input-textarea-suffix,
  .ant-input-suffix {
    margin-inline-start: 4px;
    align-self: flex-start;
    margin-top: 2px;
  }
`;

const EditableCell = ({ defaultValue = '', onSave, onRemove, type, column, ...rest }) => {
  const { members } = useAdminContext();
  const [cellValue, setCellValue] = useState(() => defaultValue);
  const [options, setOptions] = useState([]);
  const cellValueRef = useRef(cellValue);
  const hasSavedRef = useRef(false);

  cellValueRef.current = cellValue;

  const commit = (value) => {
    if (hasSavedRef.current || !onSave) return;
    hasSavedRef.current = true;
    onSave(value ?? '');
  };

  useEffect(() => {
    if (column === 'topic') {
      setOptions(TOPIC_SELECT);
    } else if (column === 'members') {
      const memberOptions = members.map(({ displayName }) => displayName);
      setOptions(memberOptions);
    }
  }, [column, members]);

  if (type === 'select') {
    if (!options) return <div>loading...</div>;

    const isNoOptions = !options.filter(
      (option) => !cellValue || option.toLowerCase().includes(cellValue.toLowerCase())
    ).length;

    if (isNoOptions) {
      return (
        <Wrapper>
          <Input
            value={cellValue}
            autoFocus
            allowClear
            onChange={({ target: { value } }) => {
              setCellValue(value);
            }}
            onPressEnter={({ target: { value } }) => {
              onSave(value);
            }}
            onBlur={() => {
              onSave(cellValue);
            }}
          />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Select
          {...rest}
          defaultValue={defaultValue}
          autoFocus
          allowClear
          showSearch={{
            searchValue: cellValue,
            onSearch: (value) => {
              if (cellValue.length === 1 && !value) setCellValue(value);
              if (value) setCellValue(value);
            },
          }}
          onChange={(value) => onSave(value)}
          onClear={() => onRemove()}
          value={cellValue}
          onBlur={() => {
            onSave(cellValue);
          }}
        >
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Wrapper>
    );
  }

  return (
    <NoteInputWrapper>
      <TextArea
        value={cellValue}
        autoSize={{ minRows: 1 }}
        autoFocus
        allowClear
        onChange={({ target: { value } }) => setCellValue(value)}
        onClear={() => {
          setCellValue('');
          commit('');
        }}
        onBlur={() => {
          // Defer so the clear control can commit an empty value first.
          setTimeout(() => commit(cellValueRef.current), 0);
        }}
      />
    </NoteInputWrapper>
  );
};

EditableCell.propTypes = {
  defaultValue: string,
  onSave: func,
  type: string,
  column: string,
  onRemove: func,
};

EditableCell.defaultProps = {
  defaultValue: '',
  onSave: null,
  type: '',
  column: '',
  onRemove: null,
};

export default EditableCell;
