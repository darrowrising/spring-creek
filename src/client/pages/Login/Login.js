import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Form, Alert } from 'antd';

// providers
import { UserContext } from '../../providers/User.provider';
// layout
import Layout from '../../layouts/Clean/Clean';
// utils
import { handleSubmit, handleRedirect } from './Login.utils';
// styles
import {
    Container,
    Wrapper,
    Button,
    ForgotPasswordWrapper,
    ForgotPassword,
    NoAccountWrapper,
    NoAccount
} from './Login.styles';

function Login() {
    // hooks
    const [form] = Form.useForm();
    const [isDisabled, setDisable] = useState(true);
    const [state, setState] = useState({ loading: false, errorMsg: '', redirect: '' });
    const history = useHistory();
    // data
    const { loading, errorMsg, redirect } = state;
    const {
        isFieldTouched,
        getFieldError,
    } = form;
    const { user } = useContext(UserContext);
    // handlers
    const handleState = updated => setState({ ...state, ...updated });
    const handleBtnDisable = () => {
        const names = ['email', 'password'];
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
    useEffect(() => {
        if (user) handleRedirect(history);
    }, [user]);

    return (
        <Layout>
            <Container>
                <Wrapper>
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        onFinish={isDisabled ? null : formValues => handleSubmit(formValues, handleState)}
                        onFieldsChange={handleBtnDisable}
                        hideRequiredMark
                    >
                        {errorMsg && (
                            <Alert style={{ marginBottom: '10px' }} message={errorMsg} type="error" />
                        )}
                        <Form.Item
                            label="Email Address"
                            name="email"
                            validateTrigger={['onBlur']}
                            rules={[{
                                required: true,
                                message: 'Please input your email!'
                            }, {
                                type: 'email',
                                message: 'Please provide a valid email address.',
                            }]}
                        >
                            <Input
                                placeholder="email"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{
                                required: true,
                                message: 'Please input your Password!'
                            }]}
                        >
                            <Input
                                placeholder="password"
                                size="large"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="secondary"
                                disabled={isDisabled}
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                            >
                                Log In
                            </Button>
                        </Form.Item>
                    </Form>
                </Wrapper>
                <ForgotPasswordWrapper>
                    <ForgotPassword onClick={null}>Forgot password?</ForgotPassword>
                </ForgotPasswordWrapper>
                <NoAccountWrapper>
                    <NoAccount>Don&#39;t have an account?</NoAccount>
                    <Button ghost type="secondary" onClick={() => history.push('/admin/sign-up')}>Sign Up</Button>
                </NoAccountWrapper>
            </Container>
        </Layout>
    );
}

export default Login;
