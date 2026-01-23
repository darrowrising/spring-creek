import { useEffect, useTransition, useActionState } from 'react';
import { Form, Input, TimePicker, notification } from 'antd';
import styled from 'styled-components';

import Button, { ButtonRow } from '../../../components/Button';
import { db } from '../../../utils/firebase.utils';
import { dayjs } from '../../../utils/date.utils';
import { hasPermission } from '../../../utils/permissions.utils';

const Container = styled.div`
  max-width: 560px;
`;

type FormState = {
  unitName?: string;
  meetingTime?: string;
  error?: string;
};

function UnitPage() {
  const [isLoading, startTransition] = useTransition();
  const [form] = Form.useForm();

  useEffect(() => {
    startTransition(() => {
      const ref = db.collection('settings').doc('unit');

      ref.get().then((snap) => {
        const data = (snap.data() ?? {}) as FormState;

        form.setFieldsValue({
          unitName: data.unitName ?? '',
          meetingTime: data.meetingTime ? dayjs(data.meetingTime, 'HH:mm') : null,
        });
      });
    });
  }, [form]);

  const onFinish = async (values: { unitName?: string; meetingTime?: any }) => {
    const payload: FormState = {
      unitName: values.unitName?.trim() ?? '',
      meetingTime: values.meetingTime ? values.meetingTime.format('HH:mm a') : '',
    };

    await db
      .collection('settings')
      .doc('unit')
      .set(payload, { merge: true })
      .then(() => {
        notification.success({ title: 'Success', description: 'Unit settings have been saved successfully' });
      });
  };

  return (
    <Container>
      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isLoading}>
        <Form.Item label="Unit name" name="unitName" rules={[{ required: true, message: 'Please enter a unit name' }]}>
          <Input placeholder="Spring Creek Ward" autoComplete="off" disabled={!hasPermission(['role:ultron'])} />
        </Form.Item>

        <Form.Item
          label="Unit time"
          name="meetingTime"
          rules={[{ required: true, message: 'Please select a unit time' }]}
        >
          <TimePicker format="hh:mm a" use12Hours minuteStep={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <ButtonRow>
            <Button color="primary" htmlType="submit" size="large">
              Save
            </Button>
          </ButtonRow>
        </Form.Item>
      </Form>
    </Container>
  );
}

export default UnitPage;
