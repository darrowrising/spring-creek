import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
// Components
import Layout from '../../../layouts/Main/Main';
import PageHeader from '../../../components/PageHeader/PageHeader';
// utils
import { searchList, getQuestions, unsubscribe } from './Questions.utils';
import { handleState } from '../../../utils/state.utils';
// configs
import { tableHeaders } from './Questions.configs';
// styles
// import {} from './QuestionsAdmin.styles';
import { Bar, Wrapper } from '../Members/MembersList/MembersList.styles';

const initialState = {
    list: [],
    filters: {},
    sort: {},
    searchValue: '',
    questions: [],
    loading: true,
};
const { Search } = Input;

function QuestionsAdmin() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { list, filters, sort, searchValue, questions, loading } = state;
    const columns = tableHeaders(filters, sort, searchValue);
    // handlers
    const set = (update) => handleState(update, setState);
    const handleChange = (pagination, antFilters, sorter) => {
        set({ filters: antFilters, sort: sorter });
    };
    const handleClear = () => set({ filters: {}, searchValue: '', sort: {} });
    const handleClick = () => console.info('click');
    const handleSearch = (event) => {
        const { value } = event?.target;
        set({ list: searchList(questions, value), searchValue: value });
    };
    const data = list.map((items) => ({ ...items, handleClick }));

    useEffect(() => {
        getQuestions(set);
        return () => unsubscribe();
    }, []);

    console.log('data:', data);
    return (
        <Layout>
            <PageHeader>Question List</PageHeader>
            <Bar>
                <Button onClick={handleClear}>Clear Filters and Sort</Button>
                <Search placeholder="search" onChange={handleSearch} style={{ width: 200 }} value={searchValue} />
            </Bar>
            <Wrapper>
                <Table
                    dataSource={data}
                    pagination
                    columns={columns}
                    loading={loading}
                    onChange={handleChange}
                    rowKey={(record) => record.uid}
                />
            </Wrapper>
        </Layout>
    );
}

export default QuestionsAdmin;
