import React, { useState, useEffect, useLayoutEffect } from 'react';
/* TODO: Remove this eslint disable */
/* eslint-disable */
import { Table, Button, Input, Tabs } from 'antd';
// utils
import {
    searchList,
    getSpeakers,
    unsubscribe,
    listOfYearsForTabs,
    totalNumberOfSpeakerColumns,
    scrollToDate,
    handleRowClass,
} from './Table.utils';
import { currentYear } from '../../../../utils/date.utils';
import { handleState } from '../../../../utils/state.utils';
// configs
import { tableHeaders } from './Table.config';
// styles
import { Container, Wrapper, Bar } from './Table.styles';

const { Search } = Input;
const { TabPane } = Tabs;
const initialState = {
    speakers: [],
    filterSpeakers: [],
    filters: {},
    sort: {},
    searchValue: '',
    loading: true,
    speakerYear: currentYear,
    activeTab: '1',
};

function MembersList() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { filters, sort, searchValue, speakers, loading, speakerYear, activeTab } = state;
    const columns = tableHeaders(filters, sort, searchValue, totalNumberOfSpeakerColumns(speakers));
    // handlers
    const set = (update) => handleState(update, setState);
    const handleChange = (pagination, antFilters, sorter) => {
        set({ filters: antFilters, sort: sorter });
    };
    const handleClear = () => {
        set({ filters: {}, sort: {}, searchValue: '' });
    };
    const handleSearch = (event) => {
        const { value } = event?.target;
        set({ filterSpeakers: searchList(speakers, value) });
    };

    const data = speakers.map((items) => ({ ...items, set }));
    const onTabChange = (tabIndex) => {
        const year = listOfYearsForTabs()[tabIndex - 1];
        set({ loading: true, activeTab: tabIndex.toString() });
        getSpeakers(set, year);
    };

    useEffect(() => {
        getSpeakers(set, speakerYear);
        return () => unsubscribe();
    }, []);

    useLayoutEffect(() => {
        const tableElement = document.getElementById('speakerTable');
        scrollToDate(tableElement);
    }, []);
    // useEffect(() => {
    //     if (searchValue) {
    //         /* if they have searched and made an edit to a member's record
    //          * reestablish the user's search state with the updated member list */
    //         setList(searchList(members, searchValue));
    //     } else {
    //         setList(members);
    //     }
    // }, [members]);

    return (
        <Container>
            {/* <Bar>
                <Button onClick={handleClear}>Clear Filters and Sort</Button>
                <Search placeholder="search" onChange={handleSearch} style={{ width: 200 }} value={searchValue} />
            </Bar> */}
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
                                dataSource={data}
                                pagination={false}
                                columns={columns}
                                loading={loading}
                                onChange={handleChange}
                                rowKey={(record) => record.uid}
                                scroll={{ x: 'max-content', y: 500 }}
                                size="small"
                                bordered
                                id="speakerTable"
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
