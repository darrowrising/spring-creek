import React from 'react';
// import {} from 'prop-types';
// import moment from 'moment';
import { Form, Select, Button, DatePicker, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

// layout
import Layout from '../../../layouts/Main/Main';
// configs
import members from '../../../../configs/members.config';
import hymns from '../../../../configs/hymns.config.json';
// styles
import { ButtonGroup } from './ProgramMaker.styles';

const { Option } = Select;

function memberOption() {
    return members.map((mem) => {
        const name = `${mem?.preferredName || mem.firstName} ${mem.lastName}`;
        return (
            <Option key={mem.uid} value={name}>
                {name}
            </Option>
        );
    });
}

function hymnOption() {
    return hymns.map(({ title, number }) => (
        <Option key={`${title}_${number}`} value={`${number}_${title}`}>
            {`${number}: ${title}`}
        </Option>
    ));
}

function ProgramMaker() {
    const [form] = Form.useForm();
    const {
        // isFieldTouched,
        // isFieldsTouched,
        // getFieldValue,
        // getFieldError,
        resetFields,
    } = form;
    const isDisabled = false;
    const handleConfirmBtn = () => {
        // eslint-disable-line
        // const names = ['range', 'name'];
        // const listInputsReady = (getFieldValue('goals') || []).every(item => !!item);
        // const noErrors = names.every(name => getFieldError(name).length === 0) && listInputsReady;
        // const allTouched = names.every(name => isFieldTouched(name));
        //
        // // checking validation is complete - enable confirm button
        // if (isDisabled && noErrors && allTouched) return handleState({ isDisabled: false });
        // // if an error is created after enabling confirm button - disable it
        // if (!isDisabled && !noErrors) return handleState({ isDisabled: true });
        // // edits - confirm disabled until atleast one field has been touched and all pass validation.
        // if (noErrors && isFieldsTouched() && isEdit) return handleState({ isDisabled: false });
    };
    const clearAll = () => {
        resetFields();
        // handleState(initialState);
    };
    const handleSubmit = (formData) => {
        console.log(formData);
    };

    return (
        <Layout>
            <Form
                form={form}
                colon={false}
                onFinish={!isDisabled ? handleSubmit : null}
                // initialValues={handleUpdateData(data)}
                onFieldsChange={handleConfirmBtn}
            >
                <Form.Item
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Presiding"
                    name="presiding"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select placeholder="" allowClear>
                        <Option value="Bishop Vaughn Kinghorn">Bishop Vaughn Kinghorn</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Conducting"
                    name="conducting"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select placeholder="Conducting" allowClear>
                        <Option value="Bishop Vaughn Kinghorn">Bishop Vaughn Kinghorn</Option>
                        <Option value="Peyton Smith">Peyton Smith</Option>
                        <Option value="Shay Rolfson">Shay Rolfson</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Chorister"
                    name="chorister"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select allowClear showSearch placeholder="Chorister" showArrow={false} notFoundContent={null}>
                        {memberOption()}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Opening Hymn"
                    name="opening_hymn"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select allowClear showSearch placeholder="Opening Hymn" showArrow={false} notFoundContent={null}>
                        {hymnOption()}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Invocation"
                    name="invocation"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select allowClear showSearch placeholder="Opening Prayer" showArrow={false} notFoundContent={null}>
                        {memberOption()}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Sacrament Hymn"
                    name="sacrament_hymn"
                    rules={[
                        {
                            required: true,
                            message: 'Please',
                        },
                    ]}
                >
                    <Select allowClear showSearch placeholder="Sacrament Hymn" showArrow={false} notFoundContent={null}>
                        {hymnOption()}
                    </Select>
                </Form.Item>
                <Form.List name="names">
                    {(fields, { add, remove }) => (
                        <div>
                            {fields.map((field, index) => (
                                <Form.Item label={index === 0 ? 'Speaker' : ''} required={false} key={field.key}>
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please add a speaker or remove the input.',
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="Speaker" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                    }}
                                    style={{ width: '60%' }}
                                >
                                    <PlusOutlined />
                                    Add Speaker
                                </Button>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        add('The head item', 0);
                                    }}
                                    style={{ width: '60%', marginTop: '20px' }}
                                >
                                    <PlusOutlined />
                                    Add field at head
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form.List>
                <Form.Item label="Intermediant Hymn" name="intermediant_hymn">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Intermediant Hymn"
                        showArrow={false}
                        notFoundContent={null}
                    >
                        {hymnOption()}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <ButtonGroup>
                        <Button onClick={clearAll}>Reset</Button>
                        <Button type="primary" htmlType="submit" disabled={isDisabled}>
                            Done
                        </Button>
                    </ButtonGroup>
                </Form.Item>
            </Form>
        </Layout>
    );
}

// ProgramMaker.propTypes = {

// };

// ProgramMaker.defaultProps = {

// };

export default ProgramMaker;
