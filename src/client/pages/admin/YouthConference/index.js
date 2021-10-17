import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
// import {} from 'prop-types';
// components
import Layout from '../../../layouts/Main/Main';
import PageHeader from '../../../components/PageHeader/PageHeader';
// configs
import { tableHeaders } from './configs';
// utils
import { handleState } from '../../../utils/state.utils';
import { getSignups, unsubscribe } from './utils';
// styles
import { Wrapper } from '../Members/MembersList/MembersList.styles';
import { TotalRow, TotalColumn, Title, Total } from './styles';

const initialState = {
    loading: true,
    data: [],
    totals: {
        devotionalTotal: 0,
        activityTotal: 0,
        overnightTotal: 0,
        grandTotal: 0,
    },
};

const YouthConference = () => {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const {
        data,
        loading,
        totals: { devotionalTotal, activityTotal, overnightTotal },
    } = state;
    // handlers
    const set = (update) => handleState(update, setState);

    useEffect(() => {
        getSignups(set);
        return () => unsubscribe();
    }, []);

    return (
        <Layout>
            <PageHeader>Youth Conference Attendance</PageHeader>
            <TotalRow>
                <TotalColumn>
                    <Title as="h3">
                        Devotional
                        <div>Oct 31</div>
                    </Title>
                    <Total>{devotionalTotal}</Total>
                </TotalColumn>
                <TotalColumn>
                    <Title as="h3">
                        Wed Activity
                        <div>Nov 3</div>
                    </Title>
                    <Total>{activityTotal}</Total>
                </TotalColumn>
                <TotalColumn>
                    <Title as="h3">
                        Overnight
                        <div>Nov 5 & 6</div>
                    </Title>
                    <Total>{overnightTotal}</Total>
                </TotalColumn>
            </TotalRow>
            <Wrapper>
                <Table
                    dataSource={data}
                    pagination
                    columns={tableHeaders()}
                    loading={loading}
                    rowKey={(record) => record.uid}
                />
            </Wrapper>
        </Layout>
    );
};

// YouthConference.propTypes = {

// };

// YouthConference.defaultProps = {

// };

export default YouthConference;
