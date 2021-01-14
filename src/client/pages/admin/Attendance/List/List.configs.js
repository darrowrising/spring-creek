import React from 'react';
import { Popconfirm, message, Select } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

// configs
import { dateShort } from '../../../../../configs/dateFormats.configs';
// utils
import { hasPermission } from '../../../../utils/permissions.utils';
import { store as db } from '../../../../utils/firebase.utils';
// styles
import { ButtonWrapper, EditIcon, DeleteIcon, ConfirmMessage, Reason } from './List.styles';

const mainDefaultColumns = (sort) => [
    {
        title: 'Family',
        dataIndex: 'name',
        key: 'family',
        className: 'center',
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sort.columnKey === 'family' && sort.order,
        // render: record => <span dangerouslySetInnerHTML={{ __html: markSearchValue(record, searchValue) }} />
    },
    {
        title: 'Attending',
        dataIndex: 'headcount',
        key: 'headcount',
        className: 'center',
    },
    {
        title: 'Signed Up',
        dataIndex: 'createdOn',
        key: 'signedUpDate',
        className: 'center',
        render: (record) => dayjs(record).format(dateShort),
    },
];

const reasons = [
    {
        value: 'overlimit',
        title: 'Overlimit, Asked to Stay Home',
    },
    {
        value: 'duplicate',
        title: 'Remove Duplicate',
    },
    {
        value: 'unable',
        title: 'Plans Changed, Unable to Attend',
    },
];

const { Option } = Select;

let reason = reasons[0].value;

export const mainTableColumns = (user = {}, sort, set) => {
    // data
    let columns = mainDefaultColumns(sort);
    // handlers
    const deleteRecord = ({ uid }) => {
        db.collection('attendance')
            .doc(uid)
            .update({
                status: 'inactive',
                reason,
            })
            .then(() => {
                message.success('Record has been removed');
            });
    };

    if (hasPermission(user?.permissions, ['calling:Ward_Clerk'])) {
        columns = [
            ...columns,
            {
                title: 'More',
                key: 'more',
                render: (record) => (
                    <ButtonWrapper>
                        <EditIcon onClick={() => set({ modalContent: record, showModal: true })} />
                        <Popconfirm
                            placement="topRight"
                            title={
                                <div>
                                    <ConfirmMessage>Are you sure you want to delete?</ConfirmMessage>
                                    <Reason>Reason</Reason>
                                    <Select
                                        defaultValue={reasons[0].title}
                                        onChange={(val) => {
                                            reason = val;
                                        }}
                                    >
                                        {reasons.map(({ value, title }, index) => (
                                            <Option key={`${value}_${index}` /* eslint-disable-line */} value={value}>
                                                {title}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            }
                            onConfirm={() => deleteRecord(record)}
                            okText="Yes"
                            cancelText="No"
                            icon={<DeleteFilled />}
                        >
                            <DeleteIcon />
                        </Popconfirm>
                    </ButtonWrapper>
                ),
            },
        ];
    }

    return columns;
};

export const statTableColumns = [
    {
        title: 'Families',
        dataIndex: 'households',
        key: 'families',
        className: 'center',
    },
    {
        title: 'Headcount',
        dataIndex: 'headcount',
        key: 'totalHeadcount',
        className: 'center',
    },
    {
        title: '',
        key: 'empty',
    },
];
