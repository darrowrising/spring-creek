import { useState } from 'react';
import { func } from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';

import { debounce } from '../../../../../utils/data.utils';
import { db, docs } from '../../../../../utils/firebase.utils';
import { markSearchValue } from '../../../../../utils/data.utils';

const getAllPrograms = () => db.collection('program').get().then(docs);

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

const filterPrograms = ({ programs, searchValue }) => {
  const contains = (prayer) => prayer.toLowerCase().includes(searchValue.toLowerCase());

  if (!searchValue) return [];

  return programs
    .filter(({ benediction = '', invocation = '' }) => {
      return contains(benediction) || contains(invocation);
    })
    .map(({ benediction, invocation, ...rest }) => ({
      ...rest,
      benediction,
      invocation,
      displayName: contains(benediction) ? benediction : invocation,
      lastPrayed: contains(benediction) ? 'benediction' : 'invocation',
    }))
    .map(({ displayName, ...rest }) => ({
      ...rest,
      displayName: <span dangerouslySetInnerHTML={{ __html: markSearchValue(displayName, searchValue) }} />,
    }))
    .sort((a, b) => {
      if (a.date > b.date) return -1;
      else if (a.date < b.date) return 1;
      return 0;
    });
};

const defaultSet = () => undefined;

const SearchProgram = ({ defaultTab, set = defaultSet, ...rest }) => {
  const [programs, setPrograms] = useState([]);

  const handleChange = async ({ target: { value } }) => {
    let programsData = programs;
    if (programs.length === 0) {
      const programs = await getAllPrograms();
      programsData = programs;
      setPrograms(programs);
    }
    const prayers = filterPrograms({ programs: programsData, searchValue: value });
    const activeTab = value ? 'search' : defaultTab;

    set({ prayers, activeTab });
  };

  return (
    <SearchContainer {...rest}>
      <Search placeholder="search members" allowClear onChange={debounce(handleChange)} />
    </SearchContainer>
  );
};

SearchProgram.propTypes = {
  set: func,
};

export default SearchProgram;
