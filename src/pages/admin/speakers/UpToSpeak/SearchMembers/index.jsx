import { func } from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';

import { useAdminContext } from '../../../../../providers/admin.provider';
import { debounce } from '../../../../../utils/data.utils';

export const SearchContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 210px;
  z-index: 1;
`;

const { Search } = Input;

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
    const speakers = filterMembers({ members, searchValue: value });
    const activeTab = value ? 'search' : 'adult';
    set({ speakers, activeTab });
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
