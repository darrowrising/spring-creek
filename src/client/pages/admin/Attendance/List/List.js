import React, { useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Table, Row, Col, InputNumber, Popover } from 'antd';
import { MinusOutlined, EditFilled } from '@ant-design/icons';
import { theme } from 'theme';

// providers
import { UserContext } from '../../../../providers/User.provider';
// components
import Loading from '../../../../components/Loading/Loading';
// configs
import { mainTableColumns, statTableColumns } from './List.configs';
import { dateLong } from '../../../../../configs/dateFormats.configs';
import { attendingDates } from '../../../../../configs/unit.config';
// utils
import { getData, unsubscribe, updateActualAttendance } from './List.utils';
import { hasPermission } from '../../../../utils/permissions.utils';
import { deepSpread } from '../../../../utils/object.utils';
// styles
import {
    Container,
    Wrapper,
    // Date,
    Session,
    StatsContainer,
    Box,
    TotalHeader,
    Total,
    SelectStyled,
} from './List.styles';

const { Option } = SelectStyled;

const initialState = {
    loading: true,
    data: {},
    sessions: [],
    stats: {
        statsTableData: {}
    },
    showPopover: false
};

function List() {
    // hooks
    const [sort, setSort] = useState({});
    const { user } = useContext(UserContext);
    const [date, setDate] = useState(() => {
        const today = dayjs().unix();
        const nextService = attendingDates.find(item => today <= dayjs(item, dateLong).add(1, 'day').unix());
        return nextService;
    });
    const [state, setState] = useState(initialState);
    // data
    const { data, loading, sessions, stats, showPopover } = state;
    // hanlders
    const handleState = update => setState(deepSpread(state, update));
    const handleChange = (pagination, antFilters, sorter) => {
        setSort(sorter);
    };

    useEffect(() => {
        getData(date, setState);

        return () => unsubscribe();
    }, [date]);

    return (
        <Container>
            <SelectStyled defaultValue={date} onChange={val => setDate(val)}>
                { attendingDates.map(item => <Option value={item}>{item}</Option>)}
            </SelectStyled>
            { loading
                ? <Loading />
                : (
                    <Wrapper>
                        <Row gutter={24} style={{ width: '100%' }}>
                            <Col flex="auto">
                                <StatsContainer>
                                    <Box>
                                        <TotalHeader>Total Families</TotalHeader>
                                        <Total>{stats.totalHouseholds}</Total>
                                    </Box>
                                    <Box>
                                        <TotalHeader>Total Headcount</TotalHeader>
                                        <Total limit={stats.totalHeadcount >= 150}>{stats.totalHeadcount}</Total>
                                    </Box>
                                    <Box>
                                        <TotalHeader>Actual Attendance</TotalHeader>
                                        <Total>
                                            {stats?.actualAttendance || <MinusOutlined />}
                                            {
                                                hasPermission(user?.permissions, ['calling:Ward_Clerk'])
                                                    ? (
                                                        <Popover
                                                            placement="topRight"
                                                            content={(
                                                                <InputNumber onPressEnter={(event) => {
                                                                    const val = event.target.value;

                                                                    handleState({
                                                                        showPopover: false,
                                                                        stats: {
                                                                            actualAttendance: val
                                                                        }
                                                                    });

                                                                    updateActualAttendance(date, val);
                                                                }}
                                                                />
                                                            )}
                                                            trigger="click"
                                                            className="edit-total"
                                                            visible={showPopover}
                                                        >
                                                            <EditFilled onClick={() => handleState({ showPopover: true })} />
                                                        </Popover>
                                                    )
                                                    : null
                                            }
                                        </Total>
                                    </Box>
                                </StatsContainer>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24}>
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
                                                columns={mainTableColumns(user, sort)}
                                                dataSource={data[session]}
                                                rowKey={record => record.uid}
                                                pagination={false}
                                                onChange={handleChange}
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
                        </Row>
                    </Wrapper>
                )}
        </Container>
    );
}

export default List;
