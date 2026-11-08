import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { darken } from 'polished';
import { Drawer, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { PageHeading } from '../../components/Heading';
import { db, docs } from '../../utils/firebase.utils';
import { hasData, groupByDate } from '../../utils/data.utils';
import { isAfter } from '../../utils/date.utils';
import { deleteOutdatedEvents, syncStorageEvents } from '../../utils/announcements.utils';
import { colorGrey3 } from '../../styles/variables';
import Loader from '../../components/Loader';

import AnnouncementForm from './Form';
import StorageCard from './StorageCard';
import DisplayEvents from './DisplayEvents';

let unsubscribe = null; // eslint-disable-line

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

const ADD_TEXT = 'Add an Announcement or Event';
const EDIT_TEXT = 'Edit an Announcement or Event';

function AnnouncementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState({});
  const [storageEvents, setStorageEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEditing = Boolean(editingEvent?.uid);

  const onClose = () => {
    setIsDrawerOpen(false);
    setEditingEvent(null);
    if (searchParams.get('create')) {
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = async (uid) => {
    const doc = await db.collection('announcements').doc(uid).get();

    if (doc.exists) {
      setEditingEvent({ uid: doc.id, ...doc.data() });
      setIsDrawerOpen(true);
    }
  };

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setEditingEvent(null);
      setIsDrawerOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    unsubscribe = db.collection('announcements').onSnapshot((announcementsSnap) => {
      const data = docs(announcementsSnap) ?? [];
      deleteOutdatedEvents(data);
      const approved = data.filter(({ moderate, endDate }) => moderate === false && (!endDate || !isAfter(endDate)));
      setEvents(groupByDate(approved));
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
      <SectionContainer>{loading ? <Loader /> : <DisplayEvents events={events} />}</SectionContainer>
      <StyledDrawer
        destroyOnHidden
        open={isDrawerOpen}
        title={isEditing ? EDIT_TEXT : ADD_TEXT}
        size={700}
        onClose={onClose}
      >
        <AnnouncementForm
          key={editingEvent?.uid ?? 'new'}
          event={editingEvent ?? {}}
          onCancel={onClose}
          setStorageEvents={setStorageEvents}
        />
      </StyledDrawer>
    </AnnouncementContainer>
  );
}

export default AnnouncementsPage;
