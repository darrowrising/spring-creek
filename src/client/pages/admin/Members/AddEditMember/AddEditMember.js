import React, { useState, useEffect } from 'react';
import { shape, func } from 'prop-types';
import { Form, Button, Alert, Input, Select, Tag } from 'antd';
// utils
import { handleState } from '../../../../utils/state.utils';
import { saveMember } from './AddEditMember.utils';
// import { deepSpread } from '../../../../utils/object.utils';
// configs
import { callings } from '../../../../../configs/callings.configs';
import { organizations } from '../../../../../configs/organizations.configs';
import { roles } from '../../../../../configs/roles.configs';
import { ageGroups } from '../../../../../configs/ageGroup.configs';
// styles
// import {} from './AddEditMember.styles';

const { Option } = Select;
const initialState = {
  disableSubmitBtn: true,
  fieldError: '',
  loading: false,
  errorMessage: '',
};

function AddEditMember({ content, setParentState }) {
  // hooks
  const [form] = Form.useForm();
  const [state, setState] = useState(initialState);
  // data
  const { disableSubmitBtn, errorMessage, loading } = state;
  // handlers
  const set = (update) => handleState(update, setState);
  const handleButtonDisable = (field, allFields) => {
    const noErrors = allFields.every((name) => name.errors.length === 0);
    const allTouched = allFields.every((name) => !!name.touched);

    if (!noErrors) set({ fieldError: field[0].name[0] });
    // checking validation is complete - enable confirm button
    if (noErrors && allTouched) set({ disableSubmitBtn: false });
    // if an error is created after enabling confirm button - disable it
    if (!noErrors && allTouched && !disableSubmitBtn) set({ disableSubmitBtn: true });
  };
  const handleSubmit = (formValues) => {
    set({ loading: true });
    saveMember({ ...content, ...formValues }, set, setParentState);
  };

  useEffect(() => set(initialState), []);

  return (
    <div>
      {errorMessage && <Alert type="error" message={errorMessage} />}
      <Form
        form={form}
        colon={false}
        layout="vertical"
        onFieldsChange={handleButtonDisable}
        onFinish={handleSubmit}
        initialValues={content}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please provide a first name',
            },
          ]}
        >
          <Input name="firstName" placeholder="First Name" autoComplete="off" />
        </Form.Item>
        <Form.Item label="Preferred Name" name="preferredName">
          <Input name="preferredName" placeholder="Preferred Name" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please provide a last name',
            },
          ]}
        >
          <Input name="lastName" placeholder="Last Name" autoComplete="off" />
        </Form.Item>
        <Form.Item label="Age Group" name="ageGroup">
          <Select defaultValue="adult">
            {ageGroups.map(({ uid, name }) => (
              <Option key={uid} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={content?.email} name="email" placeholder="Email" autoComplete="off" />
        </Form.Item>
        <Form.Item label="Callings" name="callings">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {callings.map((item) => (
              <Option key={item.name}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Organizations" name="organizations">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {organizations.map((item) => (
              <Option key={item.name}>
                <Tag color={item.color}>{item.name}</Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Roles" name="roles">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {roles.map((item) => (
              <Option key={item.name}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => setParentState({ showModal: false, modalContent: {} })}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Done
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

AddEditMember.propTypes = {
  content: shape().isRequired,
  setParentState: func.isRequired,
};

export default AddEditMember;
