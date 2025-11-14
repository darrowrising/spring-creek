import { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Alert, Form, Input, Select, Divider, DatePicker, TimePicker, Switch, notification } from 'antd';
import { darken } from 'polished';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { func, shape } from 'prop-types';

import AnnouncementCard from '../../components/Announcement';
import Button from '../../components/Button';
// import { MonthHeading } from '../../components/Heading';
import { db } from '../../utils/firebase.utils';
import { uuid, hasData } from '../../utils/data.utils';
import { getStorage, setStorage } from '../../utils/localStorage.utils';
import { utc, dayjs } from '../../utils/date.utils';
import { eventGroups } from '../../configs/organizations';
import { time as timeFormat } from '../../configs/dateFormats';
import { colorError, colorWhite3 } from '../../styles/variables';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const FormContainer = styled.div`
  background-color: var(--color-white-3);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-4);

  label.ant-form-item-required {
    height: 0 !important;
    font-size: 1.2em !important;
  }
`;

const EditorContainer = styled.div`
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
  grid-template-columns: 25% 1fr;
  column-gap: var(--space-4);
`;

const EditorWrapper = styled.div`
  flex-grow: 2;

  .rdw-editor-main {
    background-color: var(--color-white-1);
    min-height: 328px;
    padding: var(--space-5);

    .public-DraftStyleDefault-block {
      margin: 0;
    }

    &.error {
      border: 1px solid ${colorError};
    }
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const StyledTimePicker = styled(TimePicker)`
  width: 100%;
`;

const SwitchWrapper = styled.div`
  color: var(--color-primary);
  padding-bottom: var(--space-1);
`;

const PreviewContainer = styled.div`
  background-color: ${darken(0.05, colorWhite3)};
  padding: var(--space-4);
  /* display: grid;
  grid-template-rows: 1fr 3em auto; */
`;

const PreviewTitle = styled.h3`
  color: var(--color-brown-1);
  padding-bottom: var(--space-1);
`;

const CreatorSection = styled.section`
  padding: var(--space-2) 0;

  & > p {
    margin: var(--space-2) 0;
    font-size: 0.8em;
    color: var(--color-grey-1);

    & > em {
      color: var(--color-alert);
    }
  }
`;

const Name = styled.div`
  display: grid;
  column-gap: var(--space-4);
  grid-template-columns: repeat(2, 1fr);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-2);
  padding-bottom: var(--space-4);
`;

const STATUS = {
  READY: 'ready',
  ERROR: 'error',
};

const { Option } = Select;
const { RangePicker } = DatePicker;

const buildName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const createAnnouncement = ({
  title,
  group,
  message,
  endDate,
  startDate = '',
  time = '',
  createdOn,
  createdBy,
  approvedOn = '',
  approvedBy = '',
  uid,
}) => ({
  title,
  group,
  message,
  time,
  startDate,
  endDate,
  moderate: true,
  createdOn: createdOn ?? utc(),
  createdBy,
  approvedOn,
  approvedBy,
  uid: uid || uuid(),
});
const createStorageEvent = ({ title, uid, createdOn, group }) => ({
  title,
  createdOn,
  group,
  uid,
});

const INITIAL_STATE = {
  editorMessage: EditorState.createEmpty(),
  message: '',
  title: '',
  group: '',
  isAllDay: false,
  isDateRange: false,
};

const reducer = (state, { type, ...updatedState }) => {
  if (type === 'clear') return INITIAL_STATE;
  return {
    ...state,
    ...updatedState,
  };
};

function AnnouncementForm({ event = {}, onCancel, setStorageEvents = () => undefined }) {
  const [state, dispatch] = useReducer(reducer, hasData(event) ? event : INITIAL_STATE);
  const [status, setStatus] = useState(STATUS.READY);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  if (event.uid) setFieldsValue({ ...event, endDate: dayjs(event.endDate), time: dayjs() });

  const { isDateRange, editorMessage, firstName, lastName } = state;

  const validate = () => {
    let eMessage;

    if (!firstName || !lastName) eMessage = 'Please fix all required fields';

    if (eMessage) {
      setStatus(STATUS.ERROR);
      setErrorMessage(eMessage);
      return false;
    }
    setIsValid({ isValid: true });
    return true;
  };

  const handleReset = () => {
    form.resetFields();
    dispatch({ type: 'clear' });
  };
  const handleCancel = () => {
    handleReset();
    onCancel();
  };
  const handleSubmit = () => {
    validate();
  };
  const handleFinish = (values) => {
    if (isValid) {
      const announcement = createAnnouncement({
        ...values,
        ...state,
        createdBy: buildName({ firstName, lastName }),
      });
      db.collection('announcements')
        .doc(announcement.uid)
        .set(announcement)
        .then(() => {
          notification.success({
            message: 'Announcement Submitted',
          });
          const storageEvents = getStorage('events') ?? [];
          const events = [...storageEvents, createStorageEvent(announcement)];
          setStorage('events', events);
          setStorageEvents(events);
          handleCancel();
        });
    }
  };

  useEffect(() => {
    if (hasData(event)) {
      console.info('has');
      const x = form.getFieldsValue();
      console.log('x:', x, event);
    }
  }, [event]);

  return (
    <FormContainer>
      {status === STATUS.ERROR ? (
        <Alert message={errorMessage} type="error" showIcon />
      ) : (
        <Alert
          message="All announcements and events created or edited will be sent to the Bishopric for approval."
          type="info"
          showIcon
        />
      )}
      <Form name="announcement-form" layout="vertical" form={form} size="large" onFinish={handleFinish}>
        <EditorContainer>
          <div>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please add a title',
                },
              ]}
              onChange={({ target: { value } }) => dispatch({ title: value })}
            >
              <Input placeholder="title" allowClear />
            </Form.Item>
            <Form.Item
              label="Who is this event for?"
              name="group"
              rules={[
                {
                  required: true,
                  message: 'Please select a group',
                },
              ]}
            >
              <Select placeholder="group" allowClear onSelect={(group) => dispatch({ group })}>
                {eventGroups.map((group) => (
                  <Option value={group} key={group}>
                    {group}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Divider />
            <SwitchWrapper>
              date range{' '}
              <Switch
                name="date-range"
                checkedChildren="on"
                unCheckedChildren="off"
                onChange={(val) => dispatch({ isDateRange: val })}
              />
            </SwitchWrapper>
            <Form.Item
              label="Date"
              name="endDate"
              rules={[
                {
                  required: true,
                  message: 'Please provide a date',
                },
              ]}
            >
              {isDateRange ? (
                <RangePicker
                  disabledDate={(date) => utc({ date }) <= utc()}
                  onChange={([startDate, endDate]) =>
                    dispatch({ startDate: utc({ date: startDate }), endDate: utc({ date: endDate }) })
                  }
                />
              ) : (
                <StyledDatePicker
                  disabledDate={(date) => utc({ date }) <= utc()}
                  onChange={(endDate) => dispatch({ endDate: utc({ date: endDate }) })}
                />
              )}
            </Form.Item>
            <SwitchWrapper>
              all day event?{' '}
              <Switch
                name="all-day"
                checkedChildren="yes"
                unCheckedChildren="no"
                onChange={(val) => dispatch({ isAllDay: val })}
              />
            </SwitchWrapper>
            <Form.Item label="Time" name="time">
              <StyledTimePicker
                format="hh:mm a"
                disabled={isDateRange}
                onChange={(val) => {
                  console.info('time');
                  dispatch({ time: utc({ date: val, format: timeFormat }) });
                }}
              />
            </Form.Item>
          </div>
          <EditorWrapper>
            <span style={{ color: 'red' }}>*</span> Message
            <Editor
              editorClassName={status === STATUS.ERROR && !editorMessage ? 'error' : ''}
              editorState={editorMessage}
              onEditorStateChange={(content) => {
                const HTMLMessage = draftToHtml(convertToRaw(content.getCurrentContent()));
                dispatch({ message: HTMLMessage, editorMessage: content });
              }}
              toolbar={{
                options: ['inline', 'list', 'textAlign', 'history'], // 'colorPicker', 'link',
              }}
            />
          </EditorWrapper>
        </EditorContainer>
        <PreviewContainer>
          <PreviewTitle>Announcement Preview</PreviewTitle>
          {/* <MonthHeading>{getMonth(state?.endDate ?? state?.startDate)}</MonthHeading> */}
          <AnnouncementCard event={state} />
        </PreviewContainer>
        <CreatorSection>
          <p>
            <em>(Required)</em> Please give your first and last name.
          </p>
          <Name>
            <Input
              allowClear
              placeholder="first name"
              status={status === STATUS.ERROR && !firstName ? 'error' : ''}
              onChange={({ target: { value } }) => dispatch({ firstName: value })}
            />
            <Input
              allowClear
              placeholder="last name"
              status={status === STATUS.ERROR && !lastName ? 'error' : ''}
              onChange={({ target: { value } }) => dispatch({ lastName: value })}
            />
          </Name>
          <p>First and last name are used for the moderators to help them know who posted the announcement.</p>
        </CreatorSection>
        <ButtonGroup>
          <Button size="large" htmlType="submit" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button size="large" htmlType="button" onClick={handleReset}>
            Reset
          </Button>
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}

AnnouncementForm.propTypes = {
  onCancel: func.isRequired,
  setStorageEvents: func,
  event: shape({}),
};

export default AnnouncementForm;
