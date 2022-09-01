/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { func, string } from 'prop-types';
import { Input, Select } from 'antd';
// utils
import useMembers from '../useMembers';
// configs
import { TOPIC_SELECT } from '../enums';

const { TextArea } = Input;
const { Option } = Select;

const EditableCell = ({ defaultValue = '', onSave, onRemove, type, column, ...rest }) => {
  const [cellValue, setCellValue] = useState(defaultValue);
  const [options, setOptions] = useState();

  useEffect(() => {
    if (column === 'topic') {
      setOptions(TOPIC_SELECT);
    } else if (column === 'members') {
      useMembers().then((members) => {
        const memberOptions = members.map(({ displayName }) => displayName);
        setOptions(memberOptions);
      });
    }
  }, [column]);

  if (type === 'select') {
    if (!options) return <div>loading...</div>;

    const isNoOptions = !options.filter(
      (option) => !cellValue || option.toLowerCase().includes(cellValue.toLowerCase())
    ).length;
    console.info('input');
    if (isNoOptions) {
      return (
        <Input
          value={cellValue}
          autoFocus
          allowClear
          onChange={({ target: { value } }) => {
            console.info('input on change');
            setCellValue(value);
          }}
          onPressEnter={({ target: { value } }) => {
            console.info('input on press enter');
            onSave(value);
          }}
          onBlur={() => {
            console.info('input on blur');
            onSave(cellValue);
          }}
        />
      );
    }

    return (
      <Select
        {...rest}
        autoFocus
        allowClear
        searchValue={cellValue}
        showSearch
        onSearch={(value) => {
          console.info('on search');
          setCellValue(value);
        }}
        onChange={() => {
          console.info('on change');
          return onSave;
        }}
        onClear={() => {
          console.info('on clear');
          return onRemove;
        }}
        value={cellValue}
        style={{
          width: '100%',
        }}
        onBlur={() => onSave(cellValue)}
      >
        {options.map((option, index) => (
          <Option key={`${option}_${index}`} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  }

  return <TextArea autoSize defaultValue={defaultValue} autoFocus onBlur={onSave} allowClear />;
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
