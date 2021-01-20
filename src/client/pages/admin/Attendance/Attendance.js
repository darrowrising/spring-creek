import React from 'react';
import { Tabs } from 'antd';

// layouts
import Layout from '../../../layouts/Main/Main';
// components
import PageHeader from '../../../components/PageHeader/PageHeader';
import List from './List/List';
import OverLimit from './OverLimit/OverLimit';
// configs
import { covidMaxCount } from '../../../../configs/unit.config';
// styles
import { Container, Description } from './Attendance.styles';

const { TabPane } = Tabs;

function Attendance() {
    return (
        <Layout>
            <PageHeader>Sacrament Attendance</PageHeader>
            <Container>
                <Description>{`COVID-19: To help keep our numbers for sacrament attendance under the states guidlines of ${covidMaxCount} people.`}</Description>
                <Tabs type="card">
                    <TabPane tab="Attendance" key="1" style={{ background: 'white' }}>
                        <List />
                    </TabPane>
                    <TabPane tab="Asked To Watch Broadcast" key="2" style={{ background: 'white' }}>
                        <OverLimit />
                    </TabPane>
                </Tabs>
            </Container>
        </Layout>
    );
}

export default Attendance;
