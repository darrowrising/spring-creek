import { useState, useEffect, useReducer, useRef, memo, useCallback, useMemo, useDeferredValue } from 'react';
import styled from 'styled-components';
import { Form, Input, Select, DatePicker, TimePicker, Switch, notification, Collapse, Segmented } from 'antd';
import { func, shape, bool } from 'prop-types';

import AnnouncementCard from '../../components/Announcement';
import Button from '../../components/Button';
import { slateToHtml, htmlToSlate } from '../../components/Editor';
import { db } from '../../utils/firebase.utils';
import { uuid } from '../../utils/data.utils';
import { getStorage, setStorage } from '../../utils/localStorage.utils';
import { utc, dayjs } from '../../utils/date.utils';
import {
  ANNOUNCEMENT_TYPES,
  buildPendingEdit,
  hasPendingEdit,
  isPastDate,
  resolveAnnouncementType,
} from '../../utils/announcements.utils';
import {
  programDescriptionFromMessage,
  summarizeProgramDescription,
} from '../../utils/aiAnnouncement.utils';
import { normalizeUrl, isValidUrl } from '../../utils/url.utils';
import { eventGroups } from '../../configs/organizations';
import { time as timeFormat } from '../../configs/dateFormats';
import { breakpoints } from '../../styles/variables';
import EventCard from '../../components/EventCard';
import ProgramMessageField from './ProgramMessageField';
import WebsiteMessageEditor, { hasWebsiteMessage } from './WebsiteMessageEditor';

const MemoizedEventCard = memo(EventCard);
const MemoizedAnnouncementCard = memo(AnnouncementCard);

const FormContainer = styled.div`
  background-color: var(--color-white-1);
  padding: var(--space-5) var(--space-4) var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-5);

  .ant-form-item {
    margin-bottom: var(--space-4);
  }

  .ant-form-item-label > label {
    height: auto !important;
    font-size: 0.92em !important;
    font-weight: 600;
    color: var(--color-black-2);
  }

  .ant-form-item-explain {
    margin-block-end: var(--space-1);
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    border-radius: 10px !important;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 0 var(--space-4);

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1.4fr 1fr;

    & > .span-all {
      grid-column: 1 / -1;
    }
  }
`;

const TitleInput = styled(Input)`
  width: 100%;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--space-2);
  margin-bottom: var(--space-4);
`;

const MessageLabel = styled.div`
  font-size: 0.92em;
  font-weight: 600;
  color: var(--color-black-2);

  span {
    color: var(--color-alert);
    margin-right: 0.25em;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const StyledTimePicker = styled(TimePicker)`
  width: 100%;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  margin-bottom: var(--space-2);
`;

const OptionCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    font-size: 0.92em;
    color: var(--color-black-2);
  }

  span {
    font-size: 0.82em;
    color: var(--color-grey-1);
  }
`;

const TypeHelp = styled.p`
  margin: calc(var(--space-2) * -1) 0 var(--space-4);
  font-size: 0.85em;
  color: var(--color-grey-1);
`;

const QrCodeSection = styled.section`
  border: 1px solid var(--color-grey-3);
  border-radius: 12px;
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-1);
  background-color: var(--color-white-2);

  .ant-form-item {
    margin-bottom: var(--space-2);
  }
`;

const QrCodeHeading = styled.h4`
  color: var(--color-black-2);
  font-size: 0.95em;
  font-weight: 600;
  margin: 0;
`;

const QrCodeHelp = styled.p`
  margin: 0 0 var(--space-2);
  font-size: 0.82em;
  color: var(--color-grey-1);
`;

const PreviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

const PreviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const PreviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-grey-3);
`;

const PreviewEyebrow = styled.span`
  font-size: 0.95em;
  font-weight: 600;
  color: var(--color-primary);
`;

const PreviewTitle = styled.h3`
  margin: 0;
  color: var(--color-grey-1);
  font-size: 0.92em;
  font-weight: 400;
  line-height: 1.35;
`;

const CreatorSection = styled.section`
  padding: var(--space-4);
  border-radius: 12px;
  background-color: var(--color-white-2);
  border: 1px solid var(--color-grey-3);

  & > p {
    margin: 0 0 var(--space-3);
    font-size: 0.85em;
    color: var(--color-grey-1);

    & > em {
      font-style: normal;
      font-weight: 600;
      color: var(--color-alert);
    }
  }

  & > p:last-of-type {
    margin-top: var(--space-3);
    margin-bottom: 0;
  }
`;

const Name = styled.div`
  display: grid;
  column-gap: var(--space-3);
  grid-template-columns: repeat(2, 1fr);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-2);
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top, var(--color-white-1) 70%, transparent);
  padding-bottom: var(--space-2);
`;

const AdvancedCollapse = styled(Collapse)`
  margin: var(--space-2) 0 var(--space-4);
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  .ant-collapse-item {
    border: 1px solid var(--color-grey-3) !important;
    border-radius: 12px !important;
    overflow: hidden;
  }

  .ant-collapse-header {
    padding: var(--space-3) var(--space-4) !important;
    color: var(--color-black-2) !important;
    font-weight: 600 !important;
  }

  .ant-collapse-content-box {
    padding: var(--space-2) var(--space-4) var(--space-4) !important;
  }
`;

const Notice = styled.div`
  padding: var(--space-3) var(--space-4);
  border-radius: 12px;
  background: ${({ $error }) => ($error ? 'rgba(176, 65, 62, 0.08)' : 'rgba(49, 112, 142, 0.08)')};
  color: ${({ $error }) => ($error ? 'var(--color-alert)' : 'var(--color-primary)')};
  font-size: 0.9em;
  line-height: 1.4;
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
  type = ANNOUNCEMENT_TYPES.EVENT,
  createdOn,
  createdBy,
  approvedOn = '',
  approvedBy = '',
  qrLink = '',
  qrTitle = '',
  uid,
  moderate = true,
  hasPendingEdit: pendingEditFlag = false,
  pendingEdit = null,
}) => ({
  title,
  group,
  description: description ?? '',
  message,
  time,
  startDate,
  endDate,
  type: resolveAnnouncementType({ type }),
  moderate,
  createdOn: createdOn ?? utc(),
  createdBy,
  approvedOn,
  approvedBy,
  qrLink,
  qrTitle,
  uid: uid || uuid(),
  hasPendingEdit: pendingEditFlag,
  pendingEdit,
});
const createStorageEvent = ({ title, uid, createdOn, group }) => ({
  title,
  createdOn,
  group,
  uid,
});

const EMPTY_EDITOR_MESSAGE = [{ type: 'paragraph', children: [{ text: '' }] }];

const getEditorInitialValue = (event, isEditing) => {
  if (isEditing && event.message) return htmlToSlate(event.message);
  return EMPTY_EDITOR_MESSAGE;
};

const INITIAL_STATE = {
  description: '',
  message: '',
  title: '',
  group: '',
  type: ANNOUNCEMENT_TYPES.EVENT,
  isAllDay: false,
  isDateRange: false,
  location: '',
  qrLink: '',
  qrTitle: '',
  firstName: '',
  lastName: '',
};

const createInitialState = () => ({ ...INITIAL_STATE });

const parseCreatedBy = (createdBy = '') => {
  const parts = createdBy.trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');

  return { firstName, lastName };
};

const eventToFormState = (event) => {
  const { firstName, lastName } = parseCreatedBy(event.createdBy);

  const type = resolveAnnouncementType(event);

  return {
    ...createInitialState(),
    title: event.title ?? '',
    description: event.description ?? '',
    group: event.group ?? '',
    type,
    message: event.message ?? '',
    isDateRange: type === ANNOUNCEMENT_TYPES.EVENT && Boolean(event.startDate),
    isAllDay: !event.time,
    qrLink: event.qrLink ?? '',
    qrTitle: event.qrTitle ?? '',
    firstName,
    lastName,
    startDate: event.startDate ?? '',
    endDate: event.endDate ?? '',
    time: event.time ?? '',
  };
};

const getFormDateValues = (event) => {
  const type = resolveAnnouncementType(event);
  const isDateRange = type === ANNOUNCEMENT_TYPES.EVENT && Boolean(event.startDate);
  let endDate;

  if (isDateRange && event.startDate && event.endDate) {
    endDate = [dayjs(event.startDate), dayjs(event.endDate)];
  } else if (event.endDate) {
    endDate = dayjs(event.endDate);
  }

  return {
    title: event.title,
    group: event.group,
    type,
    description: event.description ?? '',
    endDate,
    time: event.time ? dayjs(event.time, timeFormat) : undefined,
    qrLink: event.qrLink ?? '',
    qrTitle: event.qrTitle ?? '',
    ...parseCreatedBy(event.createdBy),
  };
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

const reducer = (state, update = {}) => {
  if (update.action === 'clear') return createInitialState();

  return {
    ...state,
    ...update,
  };
};

const buildBasePreviewEvent = ({ startDate, endDate, time, group, title, type, qrLink, qrTitle }) => ({
  startDate,
  endDate,
  time,
  group,
  title,
  type,
  qrLink,
  qrTitle,
});

function ProgramPreviewCard({ form, baseEvent }) {
  const description = Form.useWatch('description', form);
  const deferredDescription = useDeferredValue(description);

  const previewEvent = useMemo(
    () => ({ ...baseEvent, description: deferredDescription ?? '' }),
    [baseEvent, deferredDescription]
  );

  return <MemoizedEventCard event={previewEvent} />;
}

ProgramPreviewCard.propTypes = {
  form: shape({}).isRequired,
  baseEvent: shape({}).isRequired,
};

const MemoizedProgramPreviewCard = memo(ProgramPreviewCard);

function WebsitePreviewCard({ baseEvent, editorMessage }) {
  const deferredEditorMessage = useDeferredValue(editorMessage);

  const previewEvent = useMemo(
    () => ({ ...baseEvent, message: slateToHtml(deferredEditorMessage) }),
    [baseEvent, deferredEditorMessage]
  );

  return <MemoizedAnnouncementCard event={previewEvent} />;
}

WebsitePreviewCard.propTypes = {
  baseEvent: shape({}).isRequired,
  editorMessage: shape({}),
};

const MemoizedWebsitePreviewCard = memo(WebsitePreviewCard);

function AnnouncementForm({
  event = {},
  draft = null,
  onCancel,
  setStorageEvents = () => undefined,
  isModeratorEdit = false,
}) {
  const isEditing = Boolean(event?.uid);
  const seedEvent = isEditing ? event : draft || event;
  const hasAiDraft = Boolean(draft) && !isEditing;
  const [state, dispatch] = useReducer(
    reducer,
    seedEvent?.title || seedEvent?.endDate || seedEvent?.message || seedEvent?.group
      ? eventToFormState(seedEvent)
      : createInitialState()
  );
  const [status, setStatus] = useState(STATUS.READY);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummarizingProgram, setIsSummarizingProgram] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [editorSeedValue, setEditorSeedValue] = useState(() =>
    getEditorInitialValue(seedEvent, isEditing || hasAiDraft)
  );
  const [previewEditorMessage, setPreviewEditorMessage] = useState(() =>
    getEditorInitialValue(seedEvent, isEditing || hasAiDraft)
  );
  const editorMessageRef = useRef(getEditorInitialValue(seedEvent, isEditing || hasAiDraft));
  const descriptionManuallyEditedRef = useRef(false);
  const programSummaryTimerRef = useRef(null);
  const programSummaryRequestRef = useRef(0);
  const [form] = Form.useForm();
  const qrInputSize = useResponsiveInputSize();
  const isLiveEdit = isEditing && event?.moderate === false && !isModeratorEdit;

  const titleRef = useRef(null);

  const { isDateRange, type } = state;
  const isAnnouncementType = type === ANNOUNCEMENT_TYPES.ANNOUNCEMENT;
  let dateFieldLabel = 'Date';
  if (isAnnouncementType) dateFieldLabel = 'Show until';
  else if (isDateRange) dateFieldLabel = 'Dates';
  const qrLinkValue = Form.useWatch('qrLink', form);
  const firstNameValue = Form.useWatch('firstName', form);
  const lastNameValue = Form.useWatch('lastName', form);
  const showQrLabel = Boolean(qrLinkValue?.trim());

  const basePreviewEvent = useMemo(
    () =>
      buildBasePreviewEvent({
        startDate: state.startDate,
        endDate: state.endDate,
        time: state.time,
        group: state.group,
        title: state.title,
        type: state.type,
        qrLink: state.qrLink,
        qrTitle: state.qrTitle,
      }),
    [state.startDate, state.endDate, state.time, state.group, state.title, state.type, state.qrLink, state.qrTitle]
  );

  const applyTypeChange = (nextType) => {
    const resolvedType = resolveAnnouncementType({ type: nextType });
    const formEndDate = form.getFieldValue('endDate');
    let preservedEndDate = state.endDate;

    if (!preservedEndDate && formEndDate) {
      if (Array.isArray(formEndDate)) {
        const [, end] = formEndDate;
        preservedEndDate = end ? utc({ date: end }) : '';
      } else {
        preservedEndDate = utc({ date: formEndDate });
      }
    }

    dispatch({
      type: resolvedType,
      isDateRange: false,
      startDate: '',
      endDate: preservedEndDate,
      time: resolvedType === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? '' : state.time,
      isAllDay: resolvedType === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? true : state.isAllDay,
    });
    form.setFieldsValue({
      endDate: preservedEndDate ? dayjs(preservedEndDate) : undefined,
      ...(resolvedType === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? { time: undefined } : {}),
    });
  };

  const applyProgramDescription = useCallback(
    (description, { fromUser = false } = {}) => {
      form.setFieldValue('description', description);
      dispatch({ description });
      descriptionManuallyEditedRef.current = fromUser;
    },
    [form]
  );

  const requestProgramSummary = useCallback(
    async ({ force = false, notify = false } = {}) => {
      if (!force && descriptionManuallyEditedRef.current) return;
      if (!hasWebsiteMessage(editorMessageRef.current)) return;

      const messageHtml = slateToHtml(editorMessageRef.current);
      const directDescription = programDescriptionFromMessage(messageHtml);

      if (directDescription) {
        applyProgramDescription(directDescription, { fromUser: false });
        if (notify) {
          notification.success({
            title: 'Program message updated',
            description: 'Used your website message as-is — it already fits.',
          });
        }
        return;
      }

      const requestId = programSummaryRequestRef.current + 1;
      programSummaryRequestRef.current = requestId;
      setIsSummarizingProgram(true);

      try {
        const description = await summarizeProgramDescription(messageHtml);
        if (requestId !== programSummaryRequestRef.current) return;
        if (!description) {
          throw new Error('AI returned an empty program message.');
        }
        applyProgramDescription(description, { fromUser: false });
        if (notify) {
          notification.success({
            title: 'Program message updated',
            description: 'AI wrote a short blurb from your website message.',
          });
        }
      } catch (error) {
        if (requestId !== programSummaryRequestRef.current) return;
        if (notify || force) {
          notification.error({
            title: 'Could not update program message',
            description: error?.message?.replace(/^Firebase: /, '') || 'Please try again.',
          });
        }
      } finally {
        if (requestId === programSummaryRequestRef.current) {
          setIsSummarizingProgram(false);
        }
      }
    },
    [applyProgramDescription]
  );

  const handlePreviewEditorChange = useCallback(
    (content) => {
      setPreviewEditorMessage(content);
      window.clearTimeout(programSummaryTimerRef.current);
      programSummaryTimerRef.current = window.setTimeout(() => {
        requestProgramSummary({ force: false, notify: false });
      }, 1200);
    },
    [requestProgramSummary]
  );

  const handleSyncProgramMessage = useCallback(async () => {
    if (isSummarizingProgram) return;

    if (!hasWebsiteMessage(editorMessageRef.current)) {
      notification.error({
        title: 'Add a website message first',
        description: 'The program blurb is copied or summarized from the website message.',
      });
      return;
    }

    window.clearTimeout(programSummaryTimerRef.current);
    descriptionManuallyEditedRef.current = false;
    await requestProgramSummary({ force: true, notify: true });
  }, [isSummarizingProgram, requestProgramSummary]);

  useEffect(
    () => () => {
      window.clearTimeout(programSummaryTimerRef.current);
      programSummaryRequestRef.current += 1;
    },
    []
  );

  const restoreSavedName = useCallback(() => {
    const name = getStorage('announcement-name');

    if (name) {
      dispatch({ firstName: name.firstName, lastName: name.lastName });
      form.setFieldsValue({ firstName: name.firstName, lastName: name.lastName });
    }
  }, [form]);

  const handleReset = () => {
    const nextEditorValue = isModeratorEdit && isEditing ? getEditorInitialValue(event, true) : EMPTY_EDITOR_MESSAGE;

    window.clearTimeout(programSummaryTimerRef.current);
    programSummaryRequestRef.current += 1;
    descriptionManuallyEditedRef.current = false;
    form.resetFields();
    dispatch({ action: 'clear' });
    setStatus(STATUS.READY);
    setErrorMessage('');
    setIsSummarizingProgram(false);
    setEditorSeedValue(nextEditorValue);
    setPreviewEditorMessage(nextEditorValue);
    editorMessageRef.current = nextEditorValue;
    setEditorKey((key) => key + 1);

    if (isModeratorEdit && isEditing) {
      const formState = eventToFormState(event);
      dispatch(formState);
      form.setFieldsValue(getFormDateValues(event));
    } else if (!isModeratorEdit) {
      restoreSavedName();
    }
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  const handleValuesChange = (changedValues) => {
    if ('description' in changedValues) {
      descriptionManuallyEditedRef.current = true;
      dispatch({ description: changedValues.description ?? '' });
    }

    if ('type' in changedValues) {
      applyTypeChange(changedValues.type);
    } else if ('qrLink' in changedValues) {
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
        dispatch({
          startDate: '',
          endDate: endDate ? utc({ date: endDate }) : '',
        });
      }
    } else if ('time' in changedValues) {
      const { time } = changedValues;
      dispatch({ time: time ? utc({ date: time, format: timeFormat }) : '' });
    } else if (!('description' in changedValues)) {
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

    if (!isModeratorEdit && (!submitFirstName || !submitLastName)) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Please enter your first and last name');
      form.scrollToField(submitFirstName ? 'lastName' : 'firstName', { block: 'center' });
      return;
    }

    if (!hasWebsiteMessage(editorMessageRef.current)) {
      setStatus(STATUS.ERROR);
      setErrorMessage('Please add a message');
      return;
    }

    const editorMessage = editorMessageRef.current;

    setStatus(STATUS.READY);
    setErrorMessage('');
    setIsSubmitting(true);

    if (!isModeratorEdit) {
      setStorage('announcement-name', { firstName: submitFirstName, lastName: submitLastName });
    }

    const resolvedType = resolveAnnouncementType({ type: values.type ?? state.type });
    const useDateRange = resolvedType === ANNOUNCEMENT_TYPES.EVENT && isDateRange;

    const { startDate, endDate, time } = formatSubmitDates({
      endDate: values.endDate,
      time: resolvedType === ANNOUNCEMENT_TYPES.EVENT ? values.time : undefined,
      isDateRange: useDateRange,
    });

    const messageHtml = slateToHtml(editorMessage);
    const storedDescription = form.getFieldsValue(true)?.description;
    const descriptionValue =
      (typeof values.description === 'string' ? values.description : undefined) ??
      (typeof storedDescription === 'string' ? storedDescription : undefined) ??
      state.description ??
      event?.description ??
      '';

    const createdBy = isModeratorEdit
      ? event.createdBy
      : buildName({ firstName: submitFirstName, lastName: submitLastName });

    const announcement = createAnnouncement({
      ...state,
      ...values,
      type: resolvedType,
      description: descriptionValue,
      startDate: resolvedType === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? '' : startDate,
      endDate,
      time: resolvedType === ANNOUNCEMENT_TYPES.ANNOUNCEMENT ? '' : time,
      message: messageHtml,
      qrLink: qrLink ? normalizeUrl(qrLink) : '',
      qrTitle: qrLink && values.qrTitle?.trim() ? values.qrTitle.trim() : '',
      createdBy,
      createdOn: isEditing ? event.createdOn : undefined,
      uid: isEditing ? event.uid : undefined,
      moderate: isModeratorEdit ? event.moderate !== false : true,
      hasPendingEdit: false,
      pendingEdit: null,
    });

    try {
      if (isLiveEdit) {
        const pendingEdit = buildPendingEdit(announcement, { submittedBy: createdBy });
        await db.collection('announcements').doc(announcement.uid).update({
          hasPendingEdit: true,
          pendingEdit,
        });
      } else if (isModeratorEdit && hasPendingEdit(event)) {
        await db
          .collection('announcements')
          .doc(announcement.uid)
          .set({
            ...announcement,
            moderate: false,
            hasPendingEdit: false,
            pendingEdit: null,
            approvedBy: event.approvedBy || '',
            approvedOn: event.approvedOn || '',
          });
      } else {
        await db.collection('announcements').doc(announcement.uid).set(announcement);
      }

      if (!isModeratorEdit) {
        const storedEvents = getStorage('events');
        const storageEvents = Array.isArray(storedEvents) ? storedEvents : [];
        const nextStorageEvent = createStorageEvent(announcement);
        const exists = storageEvents.some((storedEvent) => storedEvent.uid === announcement.uid);
        const events =
          isEditing && exists
            ? storageEvents.map((storedEvent) =>
                storedEvent.uid === announcement.uid ? nextStorageEvent : storedEvent
              )
            : [...storageEvents.filter((storedEvent) => storedEvent.uid !== announcement.uid), nextStorageEvent];
        setStorage('events', events);
        setStorageEvents(events);
      }

      let successTitle = 'Announcement Submitted';
      if (isLiveEdit) successTitle = 'Edit submitted';
      else if (isEditing) successTitle = 'Announcement Updated';

      let successDescription;
      if (isLiveEdit) {
        successDescription = 'The current announcement stays live until the Bishopric approves your edit.';
      } else if (isEditing && !isModeratorEdit) {
        successDescription = 'Sent back to the Bishopric for approval.';
      }

      notification.success({
        title: successTitle,
        description: successDescription,
      });

      handleCancel();
    } catch {
      notification.error({
        title: 'Submission failed',
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(getFormDateValues(event));
      setEditorKey((key) => key + 1);
    } else if (hasAiDraft && draft) {
      form.setFieldsValue(getFormDateValues(draft));
      setEditorKey((key) => key + 1);
      if (!isModeratorEdit) restoreSavedName();
    } else if (!isModeratorEdit) {
      restoreSavedName();
    }
  }, [draft, event, form, hasAiDraft, isEditing, isModeratorEdit, restoreSavedName]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [titleRef]);

  let noticeText = 'Submissions go to the Bishopric for approval before they appear on the site.';
  if (hasAiDraft) {
    noticeText =
      'Drafted from your flyer or text — review and edit before submitting. It still goes to the Bishopric for approval.';
  } else if (isLiveEdit) {
    noticeText = 'Your edit goes to the Bishopric for approval. The current announcement stays live until then.';
  }

  return (
    <FormContainer>
      {status === STATUS.ERROR ? <Notice $error>{errorMessage}</Notice> : <Notice>{noticeText}</Notice>}
      <Form
        name="announcement-form"
        layout="vertical"
        form={form}
        size="large"
        requiredMark
        initialValues={isEditing || hasAiDraft ? getFormDateValues(seedEvent) : { type: ANNOUNCEMENT_TYPES.EVENT }}
        onValuesChange={handleValuesChange}
      >
        <FieldGrid>
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
            <TitleInput ref={titleRef} autoComplete="off" placeholder="What’s this about?" allowClear />
          </Form.Item>
          <Form.Item
            label="Who is this for?"
            name="group"
            rules={[
              {
                required: true,
                message: 'Please select a group',
              },
            ]}
          >
            <Select placeholder="Select a group">
              {eventGroups.map((group) => (
                <Option value={group} key={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="span-all" name="type" label="Looks like">
            <Segmented
              block
              options={[
                { label: 'Event', value: ANNOUNCEMENT_TYPES.EVENT },
                { label: 'Announcement', value: ANNOUNCEMENT_TYPES.ANNOUNCEMENT },
              ]}
            />
          </Form.Item>
          <TypeHelp className="span-all">
            {isAnnouncementType
              ? 'A notice that stays up until an end date (for example, sign-ups through May).'
              : 'Something happening on a specific day or date range.'}
          </TypeHelp>

          {!isAnnouncementType && (
            <OptionRow className="span-all">
              <OptionCopy>
                <strong>Date range</strong>
                <span>Turn on for multi-day events</span>
              </OptionCopy>
              <Switch
                name="date-range"
                checked={isDateRange}
                onChange={(val) => {
                  dispatch({ isDateRange: val, startDate: '', endDate: '' });
                  form.setFieldValue('endDate', undefined);
                }}
              />
            </OptionRow>
          )}
          <Form.Item
            className="span-all"
            label={dateFieldLabel}
            name="endDate"
            rules={[
              {
                required: true,
                message: isAnnouncementType ? 'Please provide an end date' : 'Please provide a date',
              },
            ]}
          >
            {!isAnnouncementType && isDateRange ? (
              <RangePicker
                disabledDate={isPastDate}
                onChange={(dates) => {
                  if (!dates) {
                    dispatch({ startDate: '', endDate: '' });
                    return;
                  }
                  const [startDate, endDate] = dates;
                  dispatch({ startDate: utc({ date: startDate }), endDate: utc({ date: endDate }) });
                }}
              />
            ) : (
              <StyledDatePicker
                disabledDate={isPastDate}
                onChange={(endDate) =>
                  dispatch({
                    startDate: '',
                    endDate: endDate ? utc({ date: endDate }) : '',
                  })
                }
              />
            )}
          </Form.Item>

          <EditorWrapper className="span-all">
            <MessageLabel>
              <span>*</span>
              Message
            </MessageLabel>
            <WebsiteMessageEditor
              key={editorKey}
              initialValue={editorSeedValue}
              editorMessageRef={editorMessageRef}
              onPreviewChange={handlePreviewEditorChange}
              showError={status === STATUS.ERROR}
              placeholder="Enter your announcement message..."
            />
          </EditorWrapper>
        </FieldGrid>

        <AdvancedCollapse
          ghost
          items={[
            {
              key: 'more',
              label: 'More options',
              forceRender: true,
              children: (
                <>
                  {!isAnnouncementType && (
                    <>
                      <OptionRow>
                        <OptionCopy>
                          <strong>All-day event</strong>
                          <span>Hide the time if it doesn’t matter</span>
                        </OptionCopy>
                        <Switch
                          name="all-day"
                          checked={state.isAllDay}
                          onChange={(val) => {
                            // Keep endDate registered — unmounting Time used to wipe the date field.
                            const preservedEndDate = form.getFieldValue('endDate');
                            const nextTime = val ? '' : state.time;

                            dispatch({ isAllDay: val, time: nextTime });
                            form.setFieldsValue({
                              time: nextTime ? dayjs(nextTime, timeFormat) : undefined,
                              endDate: preservedEndDate,
                            });
                          }}
                        />
                      </OptionRow>
                      <Form.Item label="Time" name="time" autoComplete="off" hidden={state.isAllDay} preserve>
                        <StyledTimePicker
                          format="hh:mm a"
                          disabled={isDateRange}
                          onChange={(val) => dispatch({ time: val ? utc({ date: val, format: timeFormat }) : '' })}
                        />
                      </Form.Item>
                    </>
                  )}
                  <QrCodeSection>
                    <QrCodeHeading>QR code</QrCodeHeading>
                    <QrCodeHelp>Optional link shown as a scannable code on the website and program</QrCodeHelp>
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
                      <Form.Item
                        label="Label (optional)"
                        name="qrTitle"
                        help="Leave blank to show the QR code without a label"
                      >
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
                  <ProgramMessageField
                    onSyncFromMessage={handleSyncProgramMessage}
                    syncLoading={isSummarizingProgram}
                  />
                </>
              ),
            },
            {
              key: 'previews',
              label: 'Previews',
              children: (
                <PreviewStack>
                  <PreviewSection>
                    <PreviewHeader>
                      <PreviewEyebrow>Sacrament program</PreviewEyebrow>
                      <PreviewTitle>How it appears in the printed program</PreviewTitle>
                    </PreviewHeader>
                    <MemoizedProgramPreviewCard form={form} baseEvent={basePreviewEvent} />
                  </PreviewSection>
                  <PreviewSection>
                    <PreviewHeader>
                      <PreviewEyebrow>Website</PreviewEyebrow>
                      <PreviewTitle>How it appears on the announcements page</PreviewTitle>
                    </PreviewHeader>
                    <MemoizedWebsitePreviewCard baseEvent={basePreviewEvent} editorMessage={previewEditorMessage} />
                  </PreviewSection>
                </PreviewStack>
              ),
            },
          ]}
        />
        {!isModeratorEdit && (
          <CreatorSection>
            <p>
              <em>Required</em> — your first and last name
            </p>
            <Name>
              <Form.Item name="firstName" style={{ marginBottom: 0 }}>
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder="First name"
                  status={status === STATUS.ERROR && !firstNameValue?.trim() ? 'error' : ''}
                />
              </Form.Item>
              <Form.Item name="lastName" style={{ marginBottom: 0 }}>
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder="Last name"
                  status={status === STATUS.ERROR && !lastNameValue?.trim() ? 'error' : ''}
                />
              </Form.Item>
            </Name>
            <p>Moderators use this to know who submitted the announcement.</p>
          </CreatorSection>
        )}
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
  draft: shape({}),
  isModeratorEdit: bool,
};

export default AnnouncementForm;
