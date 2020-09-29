import React from 'react';
import { Popconfirm, message, Select } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

// utils
import { hasPermission } from '../../../../utils/permissions.utils';
import { store as db } from '../../../../utils/firebase.utils';
// styles
import {
    ButtonWrapper,
    EditIcon,
    DeleteIcon,
    ConfirmMessage,
    Reason
} from './List.styles';

const mainDefaultColumns = [{
    title: 'Family',
    dataIndex: 'name',
    key: 'family',
    className: 'center'
}, {
    title: 'Attending',
    dataIndex: 'headcount',
    key: 'headcount',
    className: 'center'
}];

const reasons = [{
    value: 'overlimit',
    title: 'Overlimit, Asked to Stay Home'
}, {
    value: 'duplicate',
    title: 'Remove Duplicate'
}, {
    value: 'unable',
    title: 'Plans Changed, Unable to Attend'
}];

const { Option } = Select;

let reason = reasons[0].value;

export const mainTableColumns = (user = {}) => {
    // data
    let columns = mainDefaultColumns;
    // handlers
    const deleteRecord = ({ uid }) => {
        db.collection('attendance').doc(uid).update({
            status: 'inactive',
            reason
        }).then(() => {
            message.success('Record has been removed');
        });
    };

    if (hasPermission(user?.permissions, ['calling:Ward_Clerk'])) {
        columns = [
            ...mainDefaultColumns,
            {
                title: 'More',
                key: 'more',
                render: record => (
                    <ButtonWrapper>
                        <EditIcon />
                        <Popconfirm
                            placement="topRight"
                            title={(
                                <div>
                                    <ConfirmMessage>Are you sure you want to delete?</ConfirmMessage>
                                    <Reason>Reason</Reason>
                                    <Select defaultValue={reasons[0].title} onChange={(val) => { reason = val; }}>
                                        {reasons.map(({ value, title }, index) => (
                                            <Option key={`${value}_${index}` /* eslint-disable-line */} value={value}>
                                                {title}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                            onConfirm={() => deleteRecord(record)}
                            okText="Yes"
                            cancelText="No"
                            icon={<DeleteFilled />}
                        >
                            <DeleteIcon />
                        </Popconfirm>
                    </ButtonWrapper>
                )
            }
        ];
    }

    return columns;
};

export const statTableColumns = [{
    title: 'Families',
    dataIndex: 'households',
    key: 'families',
    className: 'center'
}, {
    title: 'Headcount',
    dataIndex: 'headcount',
    key: 'totalHeadcount',
    className: 'center'
}];
