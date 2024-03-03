import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Input, Form, Alert } from 'antd';
import { lighten } from 'polished';

import Button from '../../components/Button';
import { GAEvent } from '../../components/Analytics';
import { db, docs, signIn } from '../../utils/firebase.utils';
import { catchify } from '../../utils/data.utils';
import { getStorage, removeStorage } from '../../utils/localStorage.utils';
import { utc } from '../../utils/date.utils';
import { colorPrimary } from '../../styles/variables';

const Page = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .ant-form-item {
    &:last-child {
      margin-bottom: 0 !important;

      .ant-form-item-children {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }
    }
  }
`;

const Card = styled.div`
  border: 1px solid ${lighten(0.6, colorPrimary)};
  border-radius: var(--space-2);
  box-shadow: 0 0px var(--space-5) ${lighten(0.5, colorPrimary)};
  max-width: 500px;
  padding: 60px;
  position: relative;
  top: 15%;
  width: 100%;
`;

// const ForgotPasswordWrapper = styled.div`
//   margin-top: 30px;
//   position: relative;
//   top: 15%;
// `;

// const ForgotPassword = styled.span`
//   color: var(--color-grey-1);
//   cursor: pointer;
//   transition: all var(--transition-medium);

//   &:hover {
//     color: ${lighten(0.1, colorPrimary)};
//     text-decoration: underline;
//   }
// `;

const NoAccountWrapper = styled.div`
  margin-top: 15px;
  position: relative;
  top: 15%;
`;

const NoAccount = styled.span`
  display: inline-block;
  margin-right: 15px;
`;

const LOGIN_REDIRECT = '/admin';

function Login() {
  const [form] = Form.useForm();
  const [isDisabled, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { isFieldTouched, getFieldError } = form;

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);

    const [error, results] = await catchify(
      Promise.all([signIn(email, password), db.collection('members').where('email', '==', email).get()])
    );

    if (error) {
      GAEvent({
        category: 'Login',
        action: 'Error: Logging in',
        label: `${email.split('@')[0]}`,
      });
      console.log(error);
      setErrorMessage('Email and/or password incorrect. Please try again.');
      setLoading(false);
      return false;
    }

    const [, memberSnap] = results;
    const user = docs(memberSnap)[0] ?? {};
    const redirectPath = getStorage('loginRedirect');

    db.collection('members')
      .doc(user.uid)
      .update({ lastVisited: utc() })
      .then(() => {
        GAEvent({
          category: 'Login',
          action: 'Member logged in',
          label: `${email.split('@')[0]}`,
        });
      })
      .then(() => {
        if (redirectPath) removeStorage('loginRedirect');
        navigate(redirectPath || LOGIN_REDIRECT);
      });
  };

  const handleBtnDisable = () => {
    const names = ['email', 'password'];
    const noErrors = names.every((name) => getFieldError(name).length === 0);
    const allTouched = names.every((name) => isFieldTouched(name));

    // checking validation is complete - enable confirm button
    if (noErrors && allTouched) setDisable(false);
    // if an error is created after enabling confirm button - disable it
    if (!noErrors && allTouched && !isDisabled) setDisable(true);
  };

  return (
    <Page>
      <Card>
        <Form
          form={form}
          layout="vertical"
          colon={false}
          onFinish={isDisabled ? null : (formValues) => handleSubmit(formValues)}
          onFieldsChange={handleBtnDisable}
          requiredMark
        >
          {errorMessage && <Alert style={{ marginBottom: '10px' }} message={errorMessage} type="error" />}
          <Form.Item
            label="Email Address"
            name="email"
            validateTrigger={['onBlur']}
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please provide a valid email address.',
              },
            ]}
          >
            <Input placeholder="email" size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input placeholder="password" size="large" type="password" data-testid="password" />
          </Form.Item>
          <Form.Item>
            <Button color="primary" disabled={isDisabled} htmlType="submit" block size="large" loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* <ForgotPasswordWrapper>
        <ForgotPassword onClick={null}>Forgot password?</ForgotPassword>
      </ForgotPasswordWrapper> */}
      <NoAccountWrapper>
        <NoAccount>Don&#39;t have an account?</NoAccount>
        <Button ghost color="green" onClick={() => navigate('/sign-up')}>
          Sign Up
        </Button>
      </NoAccountWrapper>
    </Page>
  );
}

export default Login;
