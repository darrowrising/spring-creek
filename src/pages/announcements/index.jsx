import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { darken } from 'polished';
import { Drawer, Alert } from 'antd';
import { PlusOutlined, FormOutlined, FileImageOutlined } from '@ant-design/icons';

import { PageHeading } from '../../components/Heading';
import { db, docs } from '../../utils/firebase.utils';
import { hasData, groupByDate } from '../../utils/data.utils';
import { isAfter } from '../../utils/date.utils';
import {
  deleteOutdatedEvents,
  getEditableAnnouncement,
  partitionByAnnouncementType,
  syncStorageEvents,
} from '../../utils/announcements.utils';
import { colorGrey3 } from '../../styles/variables';
import Loader from '../../components/Loader';

import AnnouncementForm from './Form';
import AiCreateEntry from './AiCreateEntry';
import StorageCard from './StorageCard';
import DisplayEvents from './DisplayEvents';
import { draftToFormEvent } from '../../utils/aiAnnouncement.utils';

let unsubscribe = null; // eslint-disable-line

const CREATE_MODE = {
  AI: 'ai',
  MANUAL: 'manual',
};

const AnnouncementContainer = styled.div`
  width: 100%;

  && {
    max-width: var(--width-max-medium);
  }
`;

const AddButton = styled.div`
  background-color: var(--color-grey-3);
  border: 1px dashed var(--color-grey-2);
  cursor: pointer;
  display: flex;
  font-size: 0.8em;
  column-gap: var(--space-2);
  max-width: fit-content;
  padding: var(--space-5);
  margin-top: var(--space-2);
  transition: background-color var(--transition-medium);

  &:hover {
    background-color: ${darken(0.1, colorGrey3)};
  }
`;

const SectionContainer = styled.section`
  padding-top: var(--space-6);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-8);
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: var(--space-2) var(--space-5) var(--space-2) var(--space-5);
    border-bottom: none;
  }
  .ant-drawer-body {
    border-top: 1px solid var(--color-grey-2);
    padding: 0;
  }
`;

const CreateShell = styled.div`
  background-color: var(--color-white-1);
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const CreateModeBar = styled.div`
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-grey-3);
  display: flex;
  flex-direction: column;
  row-gap: var(--space-3);
  background: linear-gradient(180deg, var(--color-white-2) 0%, var(--color-white-1) 100%);
`;

const CreateModeHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    font-size: 1em;
    color: var(--color-black-2);
  }

  span {
    font-size: 0.85em;
    color: var(--color-grey-1);
  }
`;

const CreateModeOptions = styled.div`
  display: grid;
  gap: var(--space-3);

  @media (min-width: 520px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CreateModeOption = styled.button`
  appearance: none;
  text-align: left;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-grey-3)')};
  background: ${({ $active }) => ($active ? 'rgba(49, 112, 142, 0.08)' : 'var(--color-white-1)')};
  color: var(--color-black-2);
  border-radius: 14px;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition:
    border-color var(--transition-medium),
    background-color var(--transition-medium),
    transform var(--transition-medium);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-1px);
  }

  .mode-icon {
    color: var(--color-primary);
    font-size: 1.15em;
  }

  strong {
    font-size: 0.98em;
  }

  span {
    font-size: 0.82em;
    color: var(--color-grey-1);
    line-height: 1.35;
  }
`;

const ADD_TEXT = 'Add an Announcement or Event';
const EDIT_TEXT = 'Edit an Announcement or Event';

function AnnouncementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [aiDraft, setAiDraft] = useState(null);
  const [createMode, setCreateMode] = useState(CREATE_MODE.MANUAL);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState({});
  const [storageEvents, setStorageEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEditing = Boolean(editingEvent?.uid);
  const isCreating = isDrawerOpen && !isEditing;
  const showAiCreate = isCreating && createMode === CREATE_MODE.AI && !aiDraft;
  const drawerTitle = isEditing ? EDIT_TEXT : ADD_TEXT;

  const resetCreateState = () => {
    setAiDraft(null);
    setCreateMode(CREATE_MODE.MANUAL);
  };

  const onClose = () => {
    setIsDrawerOpen(false);
    setEditingEvent(null);
    resetCreateState();
    if (searchParams.get('create')) {
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    resetCreateState();
    setIsDrawerOpen(true);
  };

  const handleEdit = async (uid) => {
    const doc = await db.collection('announcements').doc(uid).get();

    if (doc.exists) {
      setEditingEvent(getEditableAnnouncement({ uid: doc.id, ...doc.data() }));
      resetCreateState();
      setIsDrawerOpen(true);
    }
  };

  const handleAiDraft = (draft) => {
    setAiDraft(draftToFormEvent(draft));
  };

  const handleCreateModeChange = (nextMode) => {
    setCreateMode(nextMode);
    setAiDraft(null);
  };

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setEditingEvent(null);
      resetCreateState();
      setIsDrawerOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    unsubscribe = db.collection('announcements').onSnapshot((announcementsSnap) => {
      const data = docs(announcementsSnap) ?? [];
      deleteOutdatedEvents(data);
      const approved = data.filter(({ moderate, endDate }) => moderate === false && (!endDate || !isAfter(endDate)));
      const { announcements: noticeItems, events: eventItems } = partitionByAnnouncementType(approved);
      setAnnouncements(noticeItems);
      setEvents(groupByDate(eventItems));
      setStorageEvents(syncStorageEvents(data) ?? []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AnnouncementContainer>
      <PageHeading>Announcements and Events</PageHeading>
      <AddButton onClick={handleAdd}>
        <PlusOutlined />
        {ADD_TEXT}
      </AddButton>
      {hasData(storageEvents) && (
        <SectionContainer>
          <Alert title="Your following announcements/events are waiting for approval" type="info" />
          {storageEvents.map(({ uid, ...rest }) => (
            <StorageCard key={uid} uid={uid} onEdit={handleEdit} {...rest} />
          ))}
        </SectionContainer>
      )}
      <SectionContainer>
        {loading ? (
          <Loader />
        ) : (
          <DisplayEvents announcements={announcements} events={events} onEdit={handleEdit} />
        )}
      </SectionContainer>
      <StyledDrawer destroyOnHidden open={isDrawerOpen} title={drawerTitle} size={700} onClose={onClose}>
        {isEditing ? (
          <AnnouncementForm
            key={editingEvent.uid}
            event={editingEvent}
            onCancel={onClose}
            setStorageEvents={setStorageEvents}
          />
        ) : (
          <CreateShell>
            <CreateModeBar>
              <CreateModeHeading>
                <strong>How do you want to create this?</strong>
                <span>Pick one. You can switch anytime before submitting.</span>
              </CreateModeHeading>
              <CreateModeOptions>
                <CreateModeOption
                  type="button"
                  $active={createMode === CREATE_MODE.MANUAL}
                  onClick={() => handleCreateModeChange(CREATE_MODE.MANUAL)}
                >
                  <span className="mode-icon">
                    <FormOutlined />
                  </span>
                  <strong>Fill out myself</strong>
                  <span>Enter the details in a simple form. Best if you already know what to write.</span>
                </CreateModeOption>
                <CreateModeOption
                  type="button"
                  $active={createMode === CREATE_MODE.AI}
                  onClick={() => handleCreateModeChange(CREATE_MODE.AI)}
                >
                  <span className="mode-icon">
                    <FileImageOutlined />
                  </span>
                  <strong>Draft with AI</strong>
                  <span>Upload a flyer or paste text. AI fills the form for you to review.</span>
                </CreateModeOption>
              </CreateModeOptions>
            </CreateModeBar>
            {showAiCreate ? (
              <AiCreateEntry onDraft={handleAiDraft} />
            ) : (
              <AnnouncementForm
                key={aiDraft ? 'ai-draft' : 'new-manual'}
                event={{}}
                draft={aiDraft}
                onCancel={onClose}
                setStorageEvents={setStorageEvents}
              />
            )}
          </CreateShell>
        )}
      </StyledDrawer>
    </AnnouncementContainer>
  );
}

export default AnnouncementsPage;
