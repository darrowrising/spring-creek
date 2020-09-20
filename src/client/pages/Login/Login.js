import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Form } from 'antd';

// providers
import { UserContext } from '../../providers/User.provider';
// layout
import Layout from '../../layouts/Clean/Clean';
// utils
import { handleSubmit, handleRedirect, isDisabled } from './Login.utilities'; // eslint-disable-line
// styles
import {
    Container,
    Wrapper,
    Button,
    // Error,
    ForgotPasswordWrapper,
    ForgotPassword,
    NoAccountWrapper,
    NoAccount
} from './Login.styles';
/* eslint-disable */ /* TODO: Remove this eslint disable */
function Login() {
    // hooks
    const [form] = Form.useForm();
    const history = useHistory();
    const {
        // isFieldTouched,
        // getFieldError,
        getFieldsError,
        getFieldsValue
    } = form;
    // local state & data
    // const [errorMsg, setErrorMsg] = useState('');
    // const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    // error validation
    // const emailError = isFieldTouched('email') && getFieldError('email') ? 'error' : 'success';
    // const passwordError = isFieldTouched('password') && getFieldError('password') ? 'error' : 'success';
    // handlers
    const handleBtnDisable = () => {
        // const noErrors = names.every(name => getFieldError(name).length === 0);
        // const allTouched = names.every(name => isFieldTouched(name));
        //
        // // checking validation is complete - enable confirm button
        // if (noErrors && allTouched) setDisable(false);
        // // if an error is created after enabling confirm button - disable it
        // if (!noErrors && allTouched && !isDisabled) setDisable(true);
    };

    useEffect(() => {
        // if (user) handleRedirect(history);
    }, [user]);

    return (
        <Layout>
            <Container>
                <Wrapper>
                    <Form
                        form={form}
                        layout="vertical"
                        colon={false}
                        onFinish={!isDisabled ? handleSubmit : null}
                        onFieldsChange={handleBtnDisable}
                        hideRequiredMark
                    >
                        {/* errorMsg && (
                            <Error>{errorMsg}</Error>
                        ) */}
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
                                // loading={loading}
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

// Login.propTypes = {
//     form: shape().isRequired,
//     history: shape().isRequired
// };

export default Login;
