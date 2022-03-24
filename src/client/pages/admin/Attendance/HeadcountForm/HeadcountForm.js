import React, { useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import { Button, Form, InputNumber, Select } from 'antd';

// utils
import { getMembers, searchMembers } from './HeadcountForm.utils';
import { isObjectEmpty } from '../../../../utils/object.utils';
// styles
import { ButtonGroup } from './HeadcountForm.styles';

const { Option } = Select;
const buildOptions = (members) =>
  members.map((member) => (
    <Option key={member.uid} value={member?.uid || member.id}>
      {`${member?.firstName} ${member?.lastName}`.trim()}
    </Option>
  )); /* TODO: Remove this eslint disable */
/* eslint-disable */ function HeadcountForm({ data, onSubmit, onCancel }) {
    const [form] = Form.useForm();
    const [{ members, filteredMembers }, setMembers] = useState({
        members: [],
        filteredMembers: [],
    });
    const [family, setFamily] = useState(() => data?.name || null);
    const { resetFields } = form;

    useEffect(() => {
        getMembers(setMembers);
    }, []);
    useEffect(() => {
        resetFields();
    }, [data]);

    return (
        <Form
            form={form}
            colon={false}
            onFinish={(formValues) => {
                const familyInfo = filteredMembers.find((item) => item.uid === family) || data;

                onSubmit(
                    {
                        ...{
                            ...familyInfo,
                            uid: isObjectEmpty(data) ? null : data.uid,
                        },
                        ...formValues,
                    },
                    isObjectEmpty(data) ? 'add' : 'update'
                );
            }}
            layout="vertical"
            initialValues={{
                family,
                headcount: data?.headcount,
            }}
        >
            <Form.Item label="Family" name="family">
                <Select
                    showSearch
                    value={family}
                    placeholder="Family"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(value) => searchMembers(value, members, setMembers)}
                    onChange={(value) => setFamily(value)}
                    notFoundContent={null}
                >
                    {buildOptions(filteredMembers)}
                </Select>
            </Form.Item>
            <Form.Item label="Headcount" name="headcount">
                <InputNumber name="headcount" placeholder="Headcount" style={{ width: '100px' }} />
            </Form.Item>
            <Form.Item>
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            resetFields();
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </ButtonGroup>
            </Form.Item>
        </Form>
    );
}

HeadcountForm.propTypes = {
    data: shape(),
    onSubmit: func,
    onCancel: func,
};

HeadcountForm.defaultProps = {
    data: {},
    onSubmit: null,
    onCancel: null,
};

export default HeadcountForm;
