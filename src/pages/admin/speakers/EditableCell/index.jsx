import React, { useEffect, useState } from 'react';
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
`;

const EditableCell = ({ defaultValue = '', onSave, onRemove, type, column, ...rest }) => {
  const { members } = useAdminContext();
  const [cellValue, setCellValue] = useState(() => defaultValue);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (column === 'topic') {
      setOptions(TOPIC_SELECT);
    } else if (column === 'members') {
      const memberOptions = members.map(({ displayName }) => displayName);
      setOptions(memberOptions);
    }
  }, [column]);

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
          searchValue={cellValue}
          showSearch
          onSearch={(value) => {
            if (cellValue.length === 1 && !value) setCellValue(value);
            if (value) setCellValue(value);
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
    <Wrapper>
      <TextArea
        defaultValue={defaultValue}
        autoSize
        autoFocus
        onBlur={({ target: { value } }) => onSave(value)}
        allowClear
      />
    </Wrapper>
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
