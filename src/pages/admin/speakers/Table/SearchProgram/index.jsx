import { useState } from 'react';
import { func } from 'prop-types';
import { Input } from 'antd';
import styled from 'styled-components';

import { debounce, markSearchValue } from '../../../../../utils/data.utils';
import { db, docs } from '../../../../../utils/firebase.utils';

const getAllPrograms = () => db.collection('program').get().then(docs);

export const SearchContainer = styled.div`
  button {
    height: auto;
  }
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
  const contains = (value = '') => value.toLowerCase().includes(searchValue.toLowerCase());

  if (!searchValue) return [];

  return programs
    .flatMap(({ program = [], topic = '', ...rest }) => {
      const matchingTalks = program.filter(({ type, value }) => type === 'talk' && contains(value));

      return matchingTalks.map(({ value }) => ({
        ...rest,
        topic,
        program,
        searchName: value,
        displayName: <span dangerouslySetInnerHTML={{ __html: markSearchValue(value, searchValue) }} />,
      }));
    })
    .sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });
};

const defaultSet = () => undefined;
const defaultOnClear = () => undefined;

const SearchProgram = ({ set = defaultSet, onClear = defaultOnClear, ...rest }) => {
  const [programs, setPrograms] = useState([]);

  const handleChange = async ({ target: { value } }) => {
    if (!value) {
      onClear();
      return;
    }

    let programsData = programs;
    if (programs.length === 0) {
      const allPrograms = await getAllPrograms();
      programsData = allPrograms;
      setPrograms(allPrograms);
    }
    const speakers = filterPrograms({ programs: programsData, searchValue: value });

    set({ speakers, activeTab: 'search' });
  };

  return (
    <SearchContainer {...rest}>
      <Search placeholder="search members" allowClear onChange={debounce(handleChange)} />
    </SearchContainer>
  );
};

SearchProgram.propTypes = {
  set: func,
  onClear: func,
};

export default SearchProgram;
