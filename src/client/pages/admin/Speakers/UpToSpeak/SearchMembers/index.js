import React from 'react';
import { func } from 'prop-types';
import { Input } from 'antd';
// styles
import { SearchContainer } from './styles';

const { Search } = Input;

const SearchMembers = ({ onSearch, onClear }) => (
  <SearchContainer>
    <Search
      placeholder="search members"
      allowClear
      enterButton
      onSearch={(searchValue) => {
        if (!searchValue) return onClear();
        onSearch(searchValue);
      }}
    />
  </SearchContainer>
);

SearchMembers.propTypes = {
  onSearch: func,
  onClear: func,
};

SearchMembers.defaultProps = {
  onSearch: null,
  onClear: null,
};

export default SearchMembers;
