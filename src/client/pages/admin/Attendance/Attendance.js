import React, { useEffect, useState, useContext } from 'react';
import dayjs from 'dayjs';
import { Table, Row, Col } from 'antd';
import { theme } from 'theme';

// providers
import { UserContext } from '../../../providers/User.provider';
// layouts
import Layout from '../../../layouts/Main/Main';
// components
import Loading from '../../../components/Loading/Loading';
// utils
import { getData, unsubscribe } from './Attendance.utils';
// configs
import { attendingDates } from '../../../../configs/unit.config';
import { mainTableColumns, statTableColumns } from './Attendance.configs';
import { dateLong, dateShortNoYear } from '../../../../configs/dateFormats.configs';
// styles
import {
    Description,
    Wrapper,
    SelectStyled,
    List,
    Date,
    Session,
    StatsContainer,
    Total,
    Box,
    TotalHeader,
} from './Attendance.styles';

const { Option } = SelectStyled;

const initialState = {
    loading: true,
    data: {},
    sessions: [],
    stats: {
        statsTableData: {}
    }
};

function Attendance() {
    // hooks
    const { user } = useContext(UserContext);
    const [date, setDate] = useState(() => {
        const today = dayjs().unix();
        const nextService = attendingDates.find(item => today <= dayjs(item, dateLong).unix());
        return nextService;
    });
    const [state, setState] = useState(initialState);
    // data
    const { data, loading, sessions, stats } = state;

    useEffect(() => {
        getData(date, setState);

        return () => unsubscribe();
    }, [date]);

    return (
        <Layout title="Sacrament Attendance">
            <Description>COVID-19: To help keep our numbers for sacrament attendance under the states guidlines of 99 people. We are asking members to sign up for two different services.</Description>
            <SelectStyled defaultValue={date} onChange={val => setDate(val)}>
                { attendingDates.map(item => <Option value={item}>{item}</Option>)}
            </SelectStyled>
            { loading
                ? <Loading />
                : (
                    <Wrapper>
                        <List>
                            <Row>
                                <Col span={24}>
                                    <Date>{dayjs(date, dateLong).format(dateShortNoYear)}</Date>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                <Col sm={24} md={12}>
                                    <Row>
                                        { sessions.map((session, index) => (
                                            <Col span={(24 / sessions.length) || 1} style={index !== 0 ? { borderLeft: `1px solid ${theme('color_grey_3')}` } : null}>
                                                <Session>{session}</Session>
                                            </Col>
                                        ))}
                                    </Row>
                                    <Row>
                                        { sessions.map((session, index) => (
                                            <Col span={(24 / sessions.length) || 1} style={{ borderLeft: index !== 0 ? `1px solid ${theme('color_grey_3')}` : 0, backgroundColor: theme('color_white_1') }}>
                                                <Table
                                                    columns={mainTableColumns(user)}
                                                    dataSource={data[session]}
                                                    rowKey={record => record.uid}
                                                    pagination={false}
                                                    style={index !== 0 ? { borderLeft: `1px solid ${theme('color_grey_3')}` } : null}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                    <Row>
                                        { sessions.map((session, index) => (
                                            <Col span={(24 / sessions.length) || 1} style={index !== 0 ? { borderLeft: `1px solid ${theme('color_grey_3')}` } : null}>
                                                <Table
                                                    columns={statTableColumns}
                                                    dataSource={stats.statsTableData[session]}
                                                    rowKey={record => `stats_${record.uid}`}
                                                    pagination={false}
                                                    style={index !== 0 ? { borderLeft: `1px solid ${theme('color_grey_3')}` } : null}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <StatsContainer>
                                        <Box>
                                            <TotalHeader>Total Families</TotalHeader>
                                            <Total>{stats.totalHouseholds}</Total>
                                        </Box>
                                        <Box>
                                            <TotalHeader>Total Headcount</TotalHeader>
                                            <Total>{stats.totalHeadcount}</Total>
                                        </Box>
                                    </StatsContainer>
                                </Col>
                            </Row>
                        </List>
                    </Wrapper>
                )}
        </Layout>
    );
}

// Attendance.propTypes = {

// };

// Attendance.defaultProps = {

// };

export default Attendance;
