import { useState, useEffect, useRef } from 'react';
import { Table, Tabs } from 'antd';
import styled from 'styled-components';
import { lighten } from 'polished';

import Heading from '../../../../components/Heading';

import { useAdminContext } from '../../../../providers/admin.provider';
import { useFindMember } from '../../../../utils/organizations.utils';
import { comingSunday, currentYear } from '../../../../utils/date.utils';
import { handleState, hasData } from '../../../../utils/data.utils';
import { FieldValue } from '../../../../utils/firebase.utils';
import { createTalk } from '../../../../factories/program';
import { colorGrey3, colorAlert, colorSuccess, media } from '../../../../styles/variables';
import SearchProgram from './SearchProgram';

import { tableHeaders, searchColumns } from './Table.config';
import {
  getSpeakers,
  unsubscribe,
  listOfYearsForTabs,
  totalNumberOfSpeakerColumns,
  handleRowClass,
  saveCell,
  saveMember,
  scrollToDate,
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

  ${media.mobile} {
    height: 300px;
  }
`;

export const Bar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  gap: var(--space-3);
  align-items: center;

  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  button {
    margin-right: 15px;

    ${media.tablet} {
      margin-right: 0;
    }
  }

  .left {
    margin-right: auto;

    ${media.tablet} {
      margin-right: 0;
    }
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

export const HeadingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: var(--space-2);
`;

const listOfYears = listOfYearsForTabs();

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
  const wrapperRef = useRef(null);
  const hasScrolledRef = useRef(false);

  const { searchValue, speakers, loading, speakerYear, activeTab } = state;
  const set = (update) => handleState(update, setState);

  const handleChange = (pagination, antFilters, sorter) => {
    set({ filters: antFilters, sort: sorter });
  };
  const findMember = useFindMember(members);

  const onTabChange = (tabIndex) => {
    const year = listOfYearsForTabs()[tabIndex - 1];
    hasScrolledRef.current = false;
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
    const { date, uid } = rowData;
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
      const program = [...(rowData.program ?? [])];
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
  }, [members, speakerYear]);

  useEffect(() => {
    if (loading || !hasData(speakers) || hasScrolledRef.current) return;
    if (activeTab === 'search' || speakerYear !== comingSunday().year()) return;

    hasScrolledRef.current = true;
    scrollToDate(wrapperRef.current);
  }, [loading, speakers, speakerYear, activeTab]);

  const columns = tableHeaders({
    searchValue,
    totalSpeakers: totalNumberOfSpeakerColumns(speakers),
    onCellSave,
    onCellClick,
    onCellClear,
  });

  return (
    <Container>
      <Heading color="secondary" size="sm" className="secondary-sm">
        <HeadingGrid>
          Talk Schedule
          <SearchProgram
            set={set}
            onClear={() => {
              const yearTab = String(listOfYears.indexOf(speakerYear) + 1);
              hasScrolledRef.current = false;
              set({ activeTab: yearTab, loading: true });
              getSpeakers({ set, year: speakerYear, members });
            }}
          />
        </HeadingGrid>
      </Heading>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        style={{ marginBottom: 32 }}
        onChange={onTabChange}
        items={[
          ...listOfYearsForTabs().map((year, index) => ({
            label: year,
            key: String(index + 1),
            children: (
              <Wrapper ref={year === speakerYear ? wrapperRef : null}>
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
          })),
          activeTab === 'search' && {
            key: 'search',
            label: 'Search Results',
            children: (
              <Table
                dataSource={speakers}
                pagination={false}
                columns={searchColumns}
                loading={loading}
                onChange={handleChange}
                rowKey={(record) => `${record.date}-${record.searchName}`}
                scroll={{ x: 'max-content', y: 500 }}
                size="small"
                bordered
                rowClassName={handleRowClass}
              />
            ),
          },
        ].filter(Boolean)}
      />
    </Container>
  );
}

export default MembersList;
