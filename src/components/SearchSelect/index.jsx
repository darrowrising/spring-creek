// #region imports
import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Form, Input, Select } from 'antd';
import { arrayOf, number, oneOfType, shape, string } from 'prop-types';
// #endregion imports
// #region SearchSelect
// #region styles
const Temp = styled.div`
  .ben-select-option {
    background-color: red !important;
  }
  .ben-x {
    background-color: blue !important;
  }
`;
// #endregion styles
// #region component
function SearchSelect({ label, placeholder, options, form = {}, name, 'data-testid': testId }) {
  const [searchValue, setSearchValue] = useState('');

  const noOptions = useMemo(
    () => searchValue && !options.filter(({ value }) => value.toLowerCase().includes(searchValue.toLowerCase())).length,
    [searchValue]
  );

  return (
    <Form.Item label={label} name={name}>
      <Select
        showSearch
        placeholder={placeholder}
        options={options}
        data-testid={testId}
        notFoundContent={<span />}
        onBlur={({ target: { value } }) => {
          if (value) form.setFieldValue(name, value);
        }}
        onInputKeyDown={({ code, target: { value } }) => {
          if (code === 'Enter') {
            form.setFieldValue(name, value);
          } else if (code === 'Tab') {
            form.setFieldValue(name, value);
          }
        }}
      />
    </Form.Item>
  );

  // return (
  //   <Temp>
  //     {noOptions ? (
  //       <Form.Item label={label} name={name}>
  //         <Input placeholder={placeholder} autoFocus data-testid={testId} />
  //       </Form.Item>
  //     ) : (
  //       <Form.Item label={label} name={name}>
  //         <Select
  //           showSearch
  //           placeholder={placeholder}
  //           options={options}
  //           data-testid={testId}
  //           onSearch={(value) => {
  //             setSearchValue(value);
  //           }}
  //           onInputKeyDown={({ code, target: { value } }) => {
  //             if (code === 'Enter') {
  //               form.setFieldValue(name, value);
  //             }
  //           }}
  //         />
  //       </Form.Item>
  //     )}
  // </Temp>
  // );
}

SearchSelect.propTypes = {
  label: string,
  placeholder: string,
  options: arrayOf(
    shape({
      label: string,
      value: string,
    })
  ),
  form: shape(),
  name: oneOfType([number, string]),
};

export default SearchSelect;
// #endregion component
// #endregion SearchSelect
