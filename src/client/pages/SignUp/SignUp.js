import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Form, Alert } from 'antd';

// layout
import Layout from '../../layouts/Clean/Clean';
// utils
import { handleSubmit } from './SignUp.utils';
import { GAEvent } from '../../components/Analytics/Analytics';
// styles
import {
    Container,
    Wrapper,
    Title,
    Button,
    ButtonGroup,
} from './SignUp.styles';

function SignUp() {
    // hooks
    const [form] = Form.useForm();
    const history = useHistory();
    const [isDisabled, setDisable] = useState(true);
    const [state, setState] = useState({ loading: false, errorMsg: '', redirect: '' });
    // data
    const {
        isFieldTouched,
        getFieldError,
    } = form;
    const { loading, errorMsg, redirect } = state;
    // handlers
    const handleState = update => setState({ ...state, ...update });
    const handleBtnDisable = () => {
        const names = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        const noErrors = names.every(name => getFieldError(name).length === 0);
        const allTouched = names.every(name => isFieldTouched(name));

        // checking validation is complete - enable confirm button
        if (noErrors && allTouched) setDisable(false);
        // if an error is created after enabling confirm button - disable it
        if (!noErrors && allTouched && !isDisabled) setDisable(true);
    };

    useEffect(() => {
        if (redirect) history.push(redirect);
    }, [redirect]);

    return (
        <Layout>
            <Container>
                <Wrapper>
                    <Title>Create an account</Title>
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        onFinish={isDisabled ? null : formValues => handleSubmit(formValues, handleState)}
                        onFieldsChange={handleBtnDisable}
                    >
                        {errorMsg && (
                            <Alert style={{ marginBottom: '10px' }} message={errorMsg} type="error" />
                        )}
                        <Form.Item label="Name">
                            <Form.Item
                                name="firstName"
                                rules={[{
                                    required: true,
                                    message: 'Please input your first name'
                                }]}
                                style={{ display: 'inline-block', width: 'calc(50%)', marginRight: '10px', marginBottom: '0' }}
                            >
                                <Input
                                    placeholder="First Name"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                rules={[{
                                    required: true,
                                    message: 'Please input your last name'
                                }]}
                                style={{ display: 'inline-block', width: 'calc(50% - 10px)', marginBottom: '0' }}
                            >
                                <Input
                                    placeholder="Last Name"
                                    size="large"
                                />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            label="Email Address"
                            name="email"
                            validateTrigger={['onBlur']}
                            rules={[{
                                required: true,
                                message: 'Please input your email'
                            }, {
                                type: 'email',
                                message: 'Please provide a valid email address.',
                            }]}
                        >
                            <Input
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{
                                required: true,
                                message: 'Please input your password'
                            }]}
                        >
                            <Input
                                placeholder="Password"
                                size="large"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            validateTrigger={getFieldError('confirmPassword').length === 0 ? ['onBlur'] : ['onChange']}
                            rules={[{
                                required: true,
                                message: 'Please input your password again'
                            }, ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Confirm password does not match'); // eslint-disable-line
                                },
                            })]}
                        >
                            <Input
                                placeholder="Confirm Password"
                                size="large"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <ButtonGroup>
                                <Button
                                    size="large"
                                    style={{ marginRight: '10px', width: '100%' }}
                                    onClick={() => {
                                        GAEvent({
                                            category: 'SignUp',
                                            action: 'Cancel Btn Clicked',
                                            label: 'Back to Login'
                                        });
                                        history.push('/admin/login');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="secondary"
                                    disabled={isDisabled}
                                    htmlType="submit"
                                    size="large"
                                    style={{ width: '100%' }}
                                    loading={loading}
                                >
                                    Sign Up
                                </Button>
                            </ButtonGroup>
                        </Form.Item>
                    </Form>
                </Wrapper>
            </Container>
        </Layout>
    );
}

export default SignUp;
