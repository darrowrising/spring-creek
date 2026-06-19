import { useState, useEffect, useReducer, useRef, memo, useCallback } from 'react';
import styled from 'styled-components';
import { Alert, Form, Input, Select, Divider, DatePicker, TimePicker, Switch, notification } from 'antd';
import { darken } from 'polished';
import { func, shape } from 'prop-types';

import AnnouncementCard from '../../components/Announcement';
import Button from '../../components/Button';
import Editor, { slateToHtml } from '../../components/Editor';
import { db } from '../../utils/firebase.utils';
import { uuid, hasData } from '../../utils/data.utils';
import { getStorage, setStorage } from '../../utils/localStorage.utils';
import { utc, dayjs } from '../../utils/date.utils';
import { normalizeUrl, isValidUrl } from '../../utils/url.utils';
import { eventGroups } from '../../configs/organizations';
import { time as timeFormat } from '../../configs/dateFormats';
import { colorWhite3, breakpoints } from '../../styles/variables';
import EventCard from '../../components/EventCard';
import ProgramMessageField from './ProgramMessageField';

const FormContainer = styled.div`
  background-color: var(--color-white-3);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-4);

  label {
    height: 0 !important;
    font-size: 1.2em !important;
  }

  .message-label {
    font-size: 1.2em;
  }

  .ant-form-item-explain {
    margin-block-end: var(--space-2);
  }
`;

const EditorContainer = styled.div`
  display: grid;
  column-gap: var(--space-4);
`;

const TitleInput = styled(Input)`
  width: 100%;
`;

const EditorWrapper = styled.div`
  flex-grow: 2;
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

const QrCodeSection = styled.section`
  border: 1px solid var(--color-grey-2);
  border-radius: 6px;
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-1);
  background-color: var(--color-white-1);

  label {
    font-size: 1em !important;
  }

  .ant-form-item {
    margin-bottom: var(--space-2);
  }
`;

const QrCodeHeading = styled.h4`
  color: var(--color-primary);
  font-size: 1em;
  font-weight: normal;
  margin: 0;
`;

const QrCodeHelp = styled.p`
  margin: 0 0 var(--space-1);
  font-size: 0.8em;
  color: var(--color-grey-1);
`;

const PreviewContainer = styled.div`
  background-color: ${darken(0.05, colorWhite3)};
  padding: var(--space-4);
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

  & > p:last-of-type {
    margin-top: var(--space-1);
    margin-bottom: 0;
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
  description,
  group,
  message,
  endDate,
  startDate = '',
  time = '',
  createdOn,
  createdBy,
  approvedOn = '',
  approvedBy = '',
  qrLink = '',
  qrTitle = '',
  uid,
}) => ({
  title,
  group,
  description,
  message,
  time,
  startDate,
  endDate,
  moderate: true,
  createdOn: createdOn ?? utc(),
  createdBy,
  approvedOn,
  approvedBy,
  qrLink,
  qrTitle,
  uid: uid || uuid(),
});
const createStorageEvent = ({ title, uid, createdOn, group }) => ({
  title,
  createdOn,
  group,
  uid,
});

const INITIAL_STATE = {
  editorMessage: [{ type: 'paragraph', children: [{ text: '' }] }],
  description: '',
  message: '',
  title: '',
  group: '',
  isAllDay: false,
  isDateRange: false,
  location: '',
  qrLink: '',
  qrTitle: '',
  firstName: '',
  lastName: '',
};

const createInitialState = () => ({
  ...INITIAL_STATE,
  editorMessage: [{ type: 'paragraph', children: [{ text: '' }] }],
});

const hasWebsiteMessage = (editorMessage) => {
  const html = slateToHtml(editorMessage);
  const text = html.replace(/<[^>]*>/g, '').trim();
  return Boolean(text);
};

const formatSubmitDates = ({ endDate, time, isDateRange }) => {
  let startDate = '';
  let formattedEndDate = '';
  let formattedTime = '';

  if (endDate) {
    if (Array.isArray(endDate)) {
      const [start, end] = endDate;
      startDate = start ? utc({ date: start }) : '';
      formattedEndDate = end ? utc({ date: end }) : '';
    } else {
      formattedEndDate = utc({ date: endDate });
    }
  }

  if (time && !isDateRange) {
    formattedTime = utc({ date: time, format: timeFormat });
  }

  return { startDate, endDate: formattedEndDate, time: formattedTime };
};

const useResponsiveInputSize = () => {
  const [size, setSize] = useState('large');

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoints.tablet})`);
    const onChange = () => setSize(query.matches ? 'small' : 'large');
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return size;
};

const reducer = (state, { type, ...updatedState }) => {
  if (type === 'clear') return createInitialState();

  return {
    ...state,
    ...updatedState,
  };
};

function ProgramPreview({ form, state }) {
  const description = Form.useWatch('description', form);

  return <EventCard event={{ ...state, description: description ?? '' }} />;
}

ProgramPreview.propTypes = {
  form: shape({}).isRequired,
  state: shape({}).isRequired,
};

const MemoizedProgramPreview = memo(ProgramPreview);

function AnnouncementForm({ event = {}, onCancel, setStorageEvents = () => undefined }) {
  const [state, dispatch] = useReducer(reducer, hasData(event) ? event : createInitialState());
  const [status, setStatus] = useState(STATUS.READY);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [form] = Form.useForm();
  const { setFieldsValue } = form;
  const qrInputSize = useResponsiveInputSize();

  const titleRef = useRef(null);

  if (event.uid) setFieldsValue({ ...event, endDate: dayjs(event.endDate), time: dayjs() });

  const { isDateRange, editorMessage } = state;
  const qrLinkValue = Form.useWatch('qrLink', form);
  const firstNameValue = Form.useWatch('firstName', form);
  const lastNameValue = Form.useWatch('lastName', form);
  const showQrLabel = Boolean(qrLinkValue?.trim());

  const restoreSavedName = useCallback(() => {
    const name = getStorage('announcement-name');

    if (name) {
      dispatch({ firstName: name.firstName, lastName: name.lastName });
      form.setFieldsValue({ firstName: name.firstName, lastName: name.lastName });
    }
  }, [form]);

  const handleReset = () => {
    form.resetFields();
    dispatch({ type: 'clear' });
    setStatus(STATUS.READY);
    setErrorMessage('');
    setEditorKey((key) => key + 1);
    restoreSavedName();
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  const handleValuesChange = (changedValues) => {
    if ('qrLink' in changedValues) {
      form.setFields([{ name: 'qrLink', errors: [] }]);

      if (!changedValues.qrLink?.trim()) {
        form.setFieldValue('qrTitle', '');
        dispatch({ qrLink: '', qrTitle: '' });
      } else {
        dispatch({ qrLink: changedValues.qrLink, qrTitle: form.getFieldValue('qrTitle') ?? '' });
      }
    } else if ('endDate' in changedValues) {
      const { endDate } = changedValues;

      if (Array.isArray(endDate)) {
        const [startDate, end] = endDate;
        dispatch({
          startDate: startDate ? utc({ date: startDate }) : '',
          endDate: end ? utc({ date: end }) : '',
        });
      } else {
        dispatch({ endDate: endDate ? utc({ date: endDate }) : '' });
      }
    } else if ('time' in changedValues) {
      const { time } = changedValues;
      dispatch({ time: time ? utc({ date: time, format: timeFormat }) : '' });
    } else {
      dispatch(changedValues);
    }

    if (status === STATUS.ERROR) {
      setStatus(STATUS.READY);
      setErrorMessage('');
    }
  };

  const handleSubmit = async () => {
    let values;

    try {
      values = await form.validateFields();
    } catch (errorInfo) {
      const firstError = errorInfo?.errorFields?.[0];
      setStatus(STATUS.ERROR);
      setErrorMessage(firstError?.errors?.[0] ?? 'Please fix all required fields');

      if (firstError?.name?.length) {
        form.scrollToField(firstError.name, { block: 'center' });
      }

      return;
    }

    const qrLink = values.qrLink?.trim();
    const submitFirstName = values.firstName?.trim();
    const submitLastName = values.lastName?.trim();

    if (!submitFirstName || !submitLastName) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Please enter your first and last name');
      form.scrollToField(submitFirstName ? 'lastName' : 'firstName', { block: 'center' });
      return;
    }

    if (!hasWebsiteMessage(editorMessage)) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Please add a website message');
      return;
    }

    setStatus(STATUS.READY);
    setErrorMessage('');
    setIsSubmitting(true);
    setStorage('announcement-name', { firstName: submitFirstName, lastName: submitLastName });

    const { startDate, endDate, time } = formatSubmitDates({
      endDate: values.endDate,
      time: values.time,
      isDateRange,
    });

    const announcement = createAnnouncement({
      ...state,
      ...values,
      startDate,
      endDate,
      time,
      message: state.message,
      qrLink: qrLink ? normalizeUrl(qrLink) : '',
      qrTitle: qrLink && values.qrTitle?.trim() ? values.qrTitle.trim() : '',
      createdBy: buildName({ firstName: submitFirstName, lastName: submitLastName }),
    });

    try {
      await db.collection('announcements').doc(announcement.uid).set(announcement);

      notification.success({
        message: 'Announcement Submitted',
      });
      const storageEvents = getStorage('events') ?? [];
      const events = [...storageEvents, createStorageEvent(announcement)];
      setStorage('events', events);
      setStorageEvents(events);
      handleCancel();
    } catch {
      notification.error({
        message: 'Submission failed',
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    restoreSavedName();
  }, [restoreSavedName]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  return (
    <FormContainer>
      {status === STATUS.ERROR ? (
        <Alert title={errorMessage} type="error" showIcon />
      ) : (
        <Alert
          title="All announcements and events created or edited will be sent to the Bishopric for approval."
          type="info"
          showIcon
        />
      )}
      <Form name="announcement-form" layout="vertical" form={form} size="large" onValuesChange={handleValuesChange}>
        <EditorContainer>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please add a title',
              },
            ]}
          >
            <TitleInput ref={titleRef} autoComplete="off" placeholder="title" allowClear />
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
            <Select placeholder="group" allowClear>
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
              onChange={(val) => {
                dispatch({ isDateRange: val, startDate: '', endDate: '' });
                form.setFieldValue('endDate', undefined);
              }}
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
          <Form.Item label="Time" name="time" autoComplete="off">
            <StyledTimePicker
              format="hh:mm a"
              disabled={isDateRange}
              onChange={(val) => dispatch({ time: utc({ date: val, format: timeFormat }) })}
            />
          </Form.Item>
          <QrCodeSection>
            <QrCodeHeading>QR Code (optional)</QrCodeHeading>
            <QrCodeHelp>Adds a scannable QR code to the website and program announcement</QrCodeHelp>
            <Form.Item
              label="URL"
              name="qrLink"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value?.trim() || isValidUrl(value)) return Promise.resolve();
                    return Promise.reject(new Error('Please enter a valid URL'));
                  },
                },
              ]}
            >
              <Input size={qrInputSize} autoComplete="off" placeholder="https://example.com" allowClear />
            </Form.Item>
            {showQrLabel && (
              <Form.Item label="Label (optional)" name="qrTitle" help="Leave blank to show the QR code without a label">
                <Input
                  size={qrInputSize}
                  autoComplete="off"
                  placeholder="e.g. Sign up here"
                  allowClear
                  maxLength={30}
                />
              </Form.Item>
            )}
          </QrCodeSection>
          <ProgramMessageField />
          <EditorWrapper>
            <span style={{ color: 'red' }}>*</span>
            <span className="message-label"> Website Message</span>
            <Editor
              key={editorKey}
              value={editorMessage}
              onChange={(content) => {
                const HTMLMessage = slateToHtml(content);
                dispatch({ message: HTMLMessage, editorMessage: content });
              }}
              error={status === STATUS.ERROR && !hasWebsiteMessage(editorMessage)}
              placeholder="Enter your announcement message..."
            />
          </EditorWrapper>
        </EditorContainer>
        <PreviewContainer>
          <PreviewTitle>Sacrament Program Preview</PreviewTitle>
          <MemoizedProgramPreview form={form} state={state} />
        </PreviewContainer>
        <PreviewContainer>
          <PreviewTitle>Website Announcement Preview</PreviewTitle>
          <AnnouncementCard event={state} />
        </PreviewContainer>
        <CreatorSection>
          <p>
            <em>(Required)</em> Please give your first and last name.
          </p>
          <Name>
            <Form.Item name="firstName" style={{ marginBottom: 0 }}>
              <Input
                autoComplete="off"
                allowClear
                placeholder="first name"
                status={status === STATUS.ERROR && !firstNameValue?.trim() ? 'error' : ''}
              />
            </Form.Item>
            <Form.Item name="lastName" style={{ marginBottom: 0 }}>
              <Input
                autoComplete="off"
                allowClear
                placeholder="last name"
                status={status === STATUS.ERROR && !lastNameValue?.trim() ? 'error' : ''}
              />
            </Form.Item>
          </Name>
          <p>First and last name are used for the moderators to help them know who posted the announcement.</p>
        </CreatorSection>
        <ButtonGroup>
          <Button size="large" htmlType="button" color="primary" onClick={handleSubmit} loading={isSubmitting}>
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
