import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import { arrayOf, bool, func } from 'prop-types';
// components
import PageHeader from '../../../../components/PageHeader/PageHeader';
// utils
import { searchList } from './MembersList.utils';
// configs
import { tableHeaders } from './MembersList.config';
// styles
import { Container, Wrapper, Bar } from './MembersList.styles';

const { Search } = Input;

function MembersList({ members, loading, memberState, onClick }) {
    // hooks
    const [filters, setFilters] = useState({});
    const [list, setList] = useState([]);
    const [sort, setSort] = useState({});
    const [searchValue, setSearchValue] = useState('');
    // data
    const columns = tableHeaders(filters, sort, searchValue);
    const data = list.map((items) => ({ ...items, memberState, onClick }));
    // handlers
    const handleChange = (pagination, antFilters, sorter) => {
        setFilters(antFilters);
        setSort(sorter);
    };
    const handleClear = () => {
        setFilters({});
        setSort({});
        setList(members);
        setSearchValue('');
    };
    const handleSearch = (event) => {
        const { value } = event?.target;
        setList(searchList(members, value));
        setSearchValue(value);
    };

    useEffect(() => {
        if (searchValue) {
            /* if they have searched and made an edit to a member's record
             * reestablish the user's search state with the updated member list */
            setList(searchList(members, searchValue));
        } else {
            setList(members);
        }
    }, [members]);

    return (
        <Container>
            <PageHeader>Members</PageHeader>
            <Bar>
                <Button type="primary" className="left" onClick={() => onClick({}, 'edit')}>
                    Add Member
                </Button>
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
                    scroll={{ x: 'max-content' }}
                />
            </Wrapper>
        </Container>
    );
}

MembersList.propTypes = {
    members: arrayOf().isRequired,
    loading: bool.isRequired,
    memberState: func.isRequired,
    onClick: func.isRequired,
};

export default MembersList;
