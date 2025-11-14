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
import SearchProgram from './SearchProgram';
import { colorGrey3, colorAlert, colorSuccess } from '../../../../styles/variables';

import { tableHeaders, searchColumns } from './Table.config';
import {
  getPrayers,
  unsubscribe,
  listOfYearsForTabs,
  totalNumberOfPrayerColumns,
  handleRowClass,
  saveCell,
  saveMember,
} from './Table.utils';

import { media } from '../../../../styles/variables';

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

export const TableContainer = styled.div`
  ${media.tablet} {
    overflow-x: auto;

    .ant-table {
      min-width: 900px;
    }
  }
`;

export const HeadingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: var(--space-2);

  & > div {
    position: relative;
    top: 20px;
  }
`;

const listOfYears = listOfYearsForTabs();

const initialState = {
  prayers: [],
  searchValue: '',
  loading: true,
  prayerYear: currentYear,
  activeTab: String(listOfYears.indexOf(currentYear) + 1),
};

function MembersList() {
  const [state, setState] = useState(() => initialState);
  const { members } = useAdminContext();

  const { searchValue, prayers, loading, prayerYear, activeTab } = state;
  const set = (update) => handleState(update, setState);

  const handleChange = (pagination, antFilters, sorter) => {
    set({ filters: antFilters, sort: sorter });
  };
  const findMember = useFindMember(members);

  const onTabChange = (tabIndex) => {
    const year = listOfYearsForTabs()[tabIndex - 1];
    set({ loading: true, activeTab: tabIndex.toString(), prayerYear: year });

    getPrayers({ set, year, members });
  };

  const onCellClick = ({ record, column, rowIndex }) => {
    const newPrayers = [...prayers];
    const newRecord = { ...record };

    newRecord.showInput = column;

    newPrayers.splice(rowIndex, 1, newRecord);

    set({
      prayers: newPrayers,
    });
  };

  const onCellSave = ({ value = '', column, rowData = {} }) => {
    const date = rowData.date;
    const uid = rowData.uid;
    const member = findMember({ name: value });

    const previousPrayer = rowData[column];
    const previousMember = findMember({ name: previousPrayer });

    const createPrayingHistory = { date, type: column };

    if (hasData(previousMember)) {
      saveMember({
        uid: previousMember.uid,
        prayingHistory: FieldValue().arrayRemove(createPrayingHistory),
      });
    } else if (member?.uid) {
      saveMember({
        uid: member.uid,
        prayingHistory: hasData(member.prayingHistory)
          ? FieldValue().arrayUnion(createPrayingHistory)
          : [createPrayingHistory],
      });
    }

    saveCell({
      date,
      uid,
      [column]: value,
    });
  };

  const onCellClear = () => {};

  useEffect(() => {
    if (hasData(members)) {
      getPrayers({ set, year: prayerYear, members });
      return () => unsubscribe();
    }
  }, [members]);

  const columns = tableHeaders({
    searchValue,
    totalPrayers: totalNumberOfPrayerColumns(prayers),
    onCellSave,
    onCellClick,
    onCellClear,
  });

  return (
    <Container>
      <Heading color="secondary" size="sm" className="secondary-sm">
        <HeadingGrid>
          Talk Schedule
          <SearchProgram defaultTab={activeTab} set={set} />
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
              <Wrapper>
                <TableContainer>
                  <Table
                    dataSource={prayers}
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
                </TableContainer>
              </Wrapper>
            ),
          })),
          activeTab === 'search' && {
            key: 'search',
            label: 'Search Results',
            children: (
              <Table
                dataSource={prayers}
                pagination={false}
                columns={searchColumns}
                loading={loading}
                onChange={handleChange}
                rowKey={(record) => record.displayDate}
                scroll={{ x: 'max-content', y: 500 }}
                size="small"
                bordered
                rowClassName={handleRowClass}
              />
            ),
          },
        ]}
      />
    </Container>
  );
}

export default MembersList;
