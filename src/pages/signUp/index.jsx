import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Input, Form, Alert } from 'antd';
import { lighten } from 'polished';

import Button from '../../components/Button';
import { GAEvent } from '../../components/Analytics';
import { useUser } from '../../providers/user.provider';
import { catchify, uuid, hasData } from '../../utils/data.utils';
import { db, docs, createUser } from '../../utils/firebase.utils';
import { utc } from '../../utils/date.utils';
import { createMember } from '../../factories/member';
import { colorPrimary, mobileMaxWidth } from '../../styles/variables';

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
  border-radius: 10px;
  box-shadow: 0 0px 20px ${lighten(0.5, colorPrimary)};
  max-width: 500px;
  padding: 60px;
  position: relative;
  top: 5%;
  width: 100%;

  @media screen and (max-width: ${mobileMaxWidth}) {
    top: 0;
  }
`;

const Title = styled.h2`
  margin-top: -20px;
  padding-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 20px;
`;

const LOGIN_REDIRECT = '/admin';

function SignUp() {
  const [form] = Form.useForm();
  const [isDisabled, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const { isFieldTouched, getFieldError } = form;

  const handleSubmit = async ({ firstName, lastName, email, password }) => {
    setLoading(true);

    const [error, snap] = await catchify(db.collection('members').where('email', '==', email).get());

    if (error) {
      GAEvent({
        category: 'SignUp',
        action: 'Error: Getting Member',
        label: `${firstName}_${lastName}_${email}`,
      });
      return setErrorMessage('Something went wrong, please try again.');
    }

    const userData = docs(snap)[0] || {};
    const newMember = createMember({
      uid: userData?.uid || uuid(),
      firstName,
      lastName,
      email,
      lastVisited: utc(),
      status: 'pending',
      organizations: userData?.organizations || [],
      roles: userData?.roles || [],
      callings: userData?.callings || [],
      ...userData,
    });

    const ref = db.collection('members').doc(newMember.uid);

    if (userData?.lastVisited) {
      GAEvent({
        category: 'SignUp',
        action: 'Error: Email Already Exists',
        label: `${firstName}_${lastName}_${email.split('@')[0]}`,
      });
      setLoading(false);
      return setErrorMessage('This email is already in use.');
    }
    if (userData?.email) {
      ref.update(userData);
    } else {
      ref.set(newMember);
    }

    createUser(email, password)
      .then(() => {
        GAEvent({
          category: 'SignUp',
          action: 'Account Created',
        });
        setLoading(false);
        setErrorMessage('');
      })
      .catch((err) => {
        console.error(err);
        GAEvent({
          category: 'SignUp',
          action: 'Error: Creating Account',
          label: `${firstName}_${lastName}_${email}`,
        });
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleBtnDisable = () => {
    const names = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const noErrors = names.every((name) => getFieldError(name).length === 0);
    const allTouched = names.every((name) => isFieldTouched(name));

    // checking validation is complete - enable confirm button
    if (noErrors && allTouched) setDisable(false);
    // if an error is created after enabling confirm button - disable it
    if (!noErrors && allTouched && !isDisabled) setDisable(true);
  };

  useEffect(() => {
    if (hasData(user)) navigate(LOGIN_REDIRECT);
  }, [user, navigate]);

  return (
    <Page>
      <Card>
        <Title>Create an account</Title>
        <Form
          form={form}
          layout="vertical"
          colon={false}
          onFinish={isDisabled ? null : handleSubmit}
          onFieldsChange={handleBtnDisable}
        >
          {errorMessage && <Alert style={{ marginBottom: '10px' }} message={errorMessage} type="error" />}
          <Form.Item label="Name">
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'Please input your first name',
                },
              ]}
              style={{
                display: 'inline-block',
                width: 'calc(50%)',
                marginRight: '10px',
                marginBottom: '0',
              }}
            >
              <Input placeholder="First Name" size="large" />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Please input your last name',
                },
              ]}
              style={{ display: 'inline-block', width: 'calc(50% - 10px)', marginBottom: '0' }}
            >
              <Input placeholder="Last Name" size="large" />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            validateTrigger={['onBlur']}
            rules={[
              {
                required: true,
                message: 'Please input your email',
              },
              {
                type: 'email',
                message: 'Please provide a valid email address.',
              },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
            ]}
          >
            <Input placeholder="Password" size="large" type="password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            validateTrigger={getFieldError('confirmPassword').length === 0 ? ['onBlur'] : ['onChange']}
            rules={[
              {
                required: true,
                message: 'Please input your password again',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Confirm password does not match'); // eslint-disable-line
                },
              }),
            ]}
          >
            <Input placeholder="Confirm Password" size="large" type="password" />
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
                    label: 'Back to Login',
                  });
                  navigate('/login');
                }}
              >
                Cancel
              </Button>
              <Button
                color="green"
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
      </Card>
    </Page>
  );
}

export default SignUp;
