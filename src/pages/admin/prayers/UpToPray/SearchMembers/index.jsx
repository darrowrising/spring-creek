import { func } from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';

import { useAdminContext } from '../../../../../providers/admin.provider';
import { debounce } from '../../../../../utils/data.utils';

export const SearchContainer = styled.div`
  display: flex;
`;

const Search = styled(Input.Search)`
  .ant-input-affix-wrapper {
    height: 36px;

    input {
      height: 26px;
    }
  }
`;

const filterMembers = ({ members, searchValue }) => {
  const contains = (name) => name.toLowerCase().includes(searchValue.toLowerCase());

  return members.filter(({ firstName, lastName, preferredName = '' }) => {
    const regular = contains(`${firstName} ${lastName}`);
    const preferred = contains(`${preferredName} ${lastName}`);

    return regular || preferred;
  });
};

const defaultSet = () => undefined;

const SearchMembers = ({ set = defaultSet, ...rest }) => {
  const { members } = useAdminContext();

  const handleChange = ({ target: { value } }) => {
    const prayers = filterMembers({ members, searchValue: value });
    const activeTab = value ? 'search' : 'adult';
    set({ prayers, activeTab });
  };

  return (
    <SearchContainer {...rest}>
      <Search placeholder="search members" allowClear onChange={debounce(handleChange)} />
    </SearchContainer>
  );
};

SearchMembers.propTypes = {
  set: func,
};

export default SearchMembers;
