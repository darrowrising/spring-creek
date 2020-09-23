import React from 'react';
import { Popconfirm, message } from 'antd';
import { DeleteFilled } from '@ant-design/icons';

// utils
import { hasPermission } from '../../../utils/permissions.utils';
import { store as db } from '../../../utils/firebase.utils';
// styles
import { ButtonWrapper, EditIcon, DeleteIcon } from './Attendance.styles';

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

export const mainTableColumns = (user = {}) => {
    let columns = mainDefaultColumns;
    const deleteRecord = ({ uid }) => {
        db.collection('attendance').doc(uid).delete().then(() => {
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
                            title="Are you sure you want to delete?"
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
