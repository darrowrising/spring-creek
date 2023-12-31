import React, { useState, useEffect } from 'react';
import { Table, Tabs } from 'antd';
import styled from 'styled-components';
import { lighten } from 'polished';

import Heading from '../../../../components/Heading';

import { useAdminContext } from '../../../../providers/admin.provider';
import { useFindMember } from '../../../../utils/organizations.utils';
import { currentYear } from '../../../../utils/date.utils';
import { handleState, hasData } from '../../../../utils/data.utils';
import { FieldValue } from '../../../../utils/firebase.utils';
import { createTalk } from '../../../../factories/program';
import { colorGrey3, colorAlert, colorSuccess } from '../../../../styles/variables';

import { tableHeaders } from './Table.config';
import {
  getSpeakers,
  unsubscribe,
  listOfYearsForTabs,
  totalNumberOfSpeakerColumns,
  handleRowClass,
  saveCell,
  saveMember,
} from './Table.utils';

export const Container = styled.section`
  & > ${Heading} {
    margin: var(--space-6) 0;
  }

  &.editable > textarea {
    padding: 0;
  }

  && tr td.editable {
    cursor: pointer;

    &:hover {
      background-color: #d99e3621;
    }
  }
`;

export const Wrapper = styled.div`
  height: 560px;
  overflow: scroll;

  .row-odd {
    background-color: ${lighten(0.03, colorGrey3)};

    & td:first-child {
      background-color: ${lighten(0.03, colorGrey3)};
    }
  }
  .cell {
    min-width: 75px;
    height: 49px;
  }
`;

export const Bar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;

  button {
    margin-right: 15px;
  }

  .left {
    margin-right: auto;
  }
`;

export const StatusColor = styled.span`
  color: ${(props) => {
    const { status } = props;
    if (status === 'deactivated') return `${colorAlert}`;
    if (status === 'activated') return `${colorSuccess}`;
    return 'inherit';
  }};
`;

const listOfYears = listOfYearsForTabs();
console.log('listOfYears:', listOfYears);
const initialState = {
  speakers: [],
  searchValue: '',
  loading: true,
  speakerYear: currentYear,
  activeTab: String(listOfYears.indexOf(currentYear) + 1),
};

function MembersList() {
  const [state, setState] = useState(() => initialState);
  const { members } = useAdminContext();

  const { searchValue, speakers, loading, speakerYear, activeTab } = state;
  const set = (update) => handleState(update, setState);

  const handleChange = (pagination, antFilters, sorter) => {
    set({ filters: antFilters, sort: sorter });
  };
  const findMember = useFindMember(members);

  const onTabChange = (tabIndex) => {
    const year = listOfYearsForTabs()[tabIndex - 1];
    set({ loading: true, activeTab: tabIndex.toString(), speakerYear: year });

    getSpeakers({ set, year, members });
  };

  const onCellClick = ({ record, column, rowIndex, index = 0 }) => {
    const newSpeakers = [...speakers];
    const newRecord = { ...record };

    if (column === 'topic') newRecord.showInput = 0;
    if (column === 'speaker') newRecord.showInput = index + 1;

    newSpeakers.splice(rowIndex, 1, newRecord);

    set({
      speakers: newSpeakers,
    });
  };

  const onCellSave = ({ value = '', column, index = 0, rowData = {} }) => {
    const date = rowData.date;
    const uid = rowData.uid;
    const member = findMember({ name: value });
    const priority = index;

    if (column === 'topic') {
      saveCell({
        date,
        uid,
        topic: value,
      });
    }

    if (column === 'speaker') {
      let program = [...(rowData.program ?? [])];
      const memberId = member?.uid ? { memberUid: member.uid } : {};
      const talk = createTalk({ priority, value, ...memberId });
      const arrayIndex = program.findIndex((item) => item.priority === index);
      const previousSpeaker = rowData.program[index] || {};
      const previousMember = findMember({ name: previousSpeaker.value });

      if (arrayIndex !== -1) {
        program[arrayIndex] = talk;
      } else {
        program.push(talk);
      }

      if (hasData(previousMember)) {
        saveMember({
          uid: previousMember.uid,
          speakingHistory: FieldValue().arrayRemove(date),
        });
      } else if (member?.uid) {
        saveMember({
          uid: member.uid,
          speakingHistory: member.speakingHistory.length ? FieldValue().arrayUnion(date) : [date],
        });
      }

      saveCell({
        date,
        uid,
        program,
      });
    }
  };

  const onCellClear = ({ index, rowData, column }) => {
    if (column === 'topic') {
      saveCell({
        uid: rowData.uid,
        topic: '',
      });
    } else {
      const programToRemove = rowData?.program[index];

      saveCell({
        uid: rowData?.uid,
        program: programToRemove ? FieldValue().arrayRemove(programToRemove) : [],
      });
    }
  };

  useEffect(() => {
    if (hasData(members)) {
      getSpeakers({ set, year: speakerYear, members });
      return () => unsubscribe();
    }
  }, [members]);

  const columns = tableHeaders({
    searchValue,
    totalSpeakers: totalNumberOfSpeakerColumns(speakers),
    onCellSave,
    onCellClick,
    onCellClear,
  });

  return (
    <Container>
      {/* <Bar>
            <Button onClick={handleClear}>Clear Filters and Sort</Button>
            <Search placeholder="search" onChange={handleSearch} style={{ width: 200 }} value={searchValue} />
        </Bar> */}
      <Heading color="secondary" size="sm" className="secondary-sm">
        Talk Schedule
      </Heading>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        style={{ marginBottom: 32 }}
        onChange={onTabChange}
        items={listOfYearsForTabs().map((year, index) => ({
          label: year,
          key: String(index + 1),
          children: (
            <Wrapper>
              <Table
                dataSource={speakers}
                pagination={false}
                columns={columns}
                loading={loading}
                onChange={handleChange}
                rowKey={(record) => record.displayDate}
                scroll={{ x: 'max-content', y: 500 }}
                size="small"
                bordered
                rowClassName={handleRowClass}
              />
            </Wrapper>
          ),
        }))}
      />
    </Container>
  );
}

export default MembersList;
