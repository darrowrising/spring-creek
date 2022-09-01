import React, { useState, useEffect } from 'react';
import { Table, Tabs } from 'antd';
// components
import Heading from '../../../../components/Heading';
// utils
import {
  // searchList,
  getSpeakers,
  unsubscribe,
  listOfYearsForTabs,
  totalNumberOfSpeakerColumns,
  // scrollToDate,
  handleRowClass,
  saveCell,
} from './Table.utils';
import { currentYear } from '../../../../utils/date.utils';
import { handleState } from '../../../../utils/state.utils';
import { FieldValue } from '../../../../utils/firebase.utils';
import { createTalk } from '../../../../factories/program.factory';
// configs
import { tableHeaders } from './Table.config';
import { TOPIC_SELECT } from '../enums';
// styles
import { Container, Wrapper } from './Table.styles';

// const { Search } = Input;
const { TabPane } = Tabs;
const initialState = {
  speakers: [],
  searchValue: '',
  loading: true,
  speakerYear: currentYear,
  activeTab: '1',
};

function MembersList() {
  // hooks
  const [state, setState] = useState(initialState);
  // data
  const { searchValue, speakers, loading, speakerYear, activeTab } = state;
  // handlers
  const set = (update) => handleState(update, setState);
  const handleChange = (pagination, antFilters, sorter) => {
    set({ filters: antFilters, sort: sorter });
  };
  // const handleClear = () => {
  //   set({ filters: {}, sort: {}, searchValue: '' });
  // };
  // const handleSearch = (event) => {
  //   const { value } = event?.target;
  //   set({ filterSpeakers: searchList(speakers, value) });
  // };

  // const data = speakers.map((items) => ({ ...items, set }));
  const onTabChange = (tabIndex) => {
    const year = listOfYearsForTabs()[tabIndex - 1];
    set({ loading: true, activeTab: tabIndex.toString() });
    getSpeakers(set, year);
  };

  const onCellClick = (record, column, rowIndex) => {
    const newSpeakers = [...speakers];
    const newRecord = { ...record };

    if (column === 'topic') {
      newRecord.topic = {
        ...record,
        showInput: true,
        value: '',
      };
    }

    const [columnName, columnIndex] = column.split('_');

    if (columnName === 'speaker') {
      // if no program exist, create an instance
      newRecord.program = newRecord?.program ?? [createTalk()];

      newRecord[column] = {
        ...record,
        showInput: true,
        value: newRecord[column] ?? '',
      };

      const programIndex = columnIndex - 1;
      const programRecord = newRecord.program[programIndex] ?? createTalk();

      newRecord.program[programIndex] = programRecord;
    }

    newSpeakers.splice(rowIndex, 1, newRecord);

    set({
      speakers: newSpeakers,
    });
  };

  const onCellSave = (record, value = '', column, rowIndex) => {
    const newSpeakers = [...speakers];
    const { displayDate } = record;
    const currentSpeaker = newSpeakers.find((speaker) => speaker.displayDate === displayDate) ?? {};
    const newRecord = {
      uid: currentSpeaker?.uid,
      program: currentSpeaker?.program ?? [],
    };

    if (column === 'topic') {
      const isMeeting = TOPIC_SELECT.some((item) => item === value);
      newRecord.topic = value;

      if (isMeeting) {
        newRecord.program = [
          ...newRecord.program,
          {
            type: 'meeting',
            priority: 0,
            value: value === 'Fast Sunday' ? 'Bearing of Testimonies' : value,
          },
        ];
      }
    }

    const [columnName, columnIndex] = column.split('_');

    if (columnName === 'speaker') {
      const priority = columnIndex - 1;
      const programIndex = newRecord.program?.[priority] ? priority : newRecord.program.length + 1;

      newRecord.program[programIndex] = {
        type: 'talk',
        priority,
        value,
      };

      newRecord[column] = value;

      newSpeakers.splice(rowIndex, 1, newRecord);

      set({
        speakers: newSpeakers,
      });
    }

    saveCell(newRecord);
  };

  const onCellClear = (record, programIndex, rowIndex) => {
    console.log('record', record);
    console.log('programIndex', programIndex);
    const newRecord = { ...record };
    const newSpeakers = { ...speakers };

    const programToRemove = newRecord?.program[programIndex];
    delete newRecord[`speaker_${programIndex + 1}`];

    newSpeakers.splice(rowIndex, 1, newRecord);
    console.log('newSpeakers', newSpeakers);
    console.log('newRecord', newRecord);
    set({
      speakers: newSpeakers,
    });

    saveCell({
      uid: record?.uid,
      program: FieldValue().arrayRemove(programToRemove),
    });
  };

  useEffect(() => {
    getSpeakers(set, speakerYear);
    return () => unsubscribe();
  }, []);

  // useLayoutEffect(() => {
  //   // const tableElement = document.getElementById('speakerTable');
  //   scrollToDate(tableRef.current);
  // }, []);
  // useEffect(() => {
  //     if (searchValue) {
  //         /* if they have searched and made an edit to a member's record
  //          * reestablish the user's search state with the updated member list */
  //         setList(searchList(members, searchValue));
  //     } else {
  //         setList(members);
  //     }
  // }, [members]);

  const columns = tableHeaders(
    searchValue,
    totalNumberOfSpeakerColumns(speakers),
    onCellSave,
    onCellClick,
    onCellClear
  );

  return (
    <Container>
      {/* <Bar>
            <Button onClick={handleClear}>Clear Filters and Sort</Button>
            <Search placeholder="search" onChange={handleSearch} style={{ width: 200 }} value={searchValue} />
        </Bar> */}
      <Heading secondary>Talk Schedule</Heading>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        style={{ marginBottom: 32 }}
        onChange={onTabChange}
      >
        {/* eslint-disable react/no-array-index-key */}
        {listOfYearsForTabs().map((year, index) => (
          <TabPane tab={year} key={index + 1}>
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
                // id="speakerTable"
                rowClassName={handleRowClass}
              />
            </Wrapper>
          </TabPane>
        ))}
        {/* eslint-enable */}
      </Tabs>
    </Container>
  );
}

export default MembersList;
