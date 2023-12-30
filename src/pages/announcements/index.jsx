import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { Modal, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { PageHeading } from '../../components/Heading';
import { db, docs } from '../../utils/firebase.utils';
import { getStorage, setStorage, removeStorage } from '../../utils/localStorage.utils';
import { hasData, isEmpty, groupByDate } from '../../utils/data.utils';
import { utc } from '../../utils/date.utils';
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

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 0;
  }
  .ant-modal-header {
    padding: var(--space-5) var(--space-5) 0 var(--space-5);
  }
  .ant-modal-body {
    border-top: 1px solid var(--color-grey-2);
  }
`;

const deleteOutdatedEvents = (events) => {
  const storage = getStorage('events') || [];
  const deleteEvent = (expiredEventUid) => db.collection('announcements').doc(expiredEventUid).delete();
  const removeOutdatedFromStorage = ({ uid } = {}) => {
    const newStorage = [...storage].filter(({ uid: eventId }) => uid !== eventId);

    if (isEmpty(newStorage)) removeStorage('events');
    else setStorage('events', newStorage);
  };

  events.forEach((event) => {
    const today = utc();
    const { endDate, uid } = event;
    const isLocal = storage.some(({ uid: eventId }) => eventId === uid);

    if (isLocal) removeOutdatedFromStorage(event);
    if (today > endDate) deleteEvent(uid);
  });
};

const ADD_TEXT = 'Add an Announcement or Event';

function AnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState({});
  const [storageEvents, setStorageEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const onCancel = () => setIsModalOpen(false);

  useEffect(() => {
    unsubscribe = db
      .collection('announcements')
      .where('moderate', '==', false)
      .onSnapshot((announcementsSnap) => {
        const data = docs(announcementsSnap) ?? [];
        const groupedData = groupByDate(data);
        deleteOutdatedEvents(data);
        setEvents(groupedData);
        const submittedEvents = getStorage('events');
        setStorageEvents(submittedEvents);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  return (
    <AnnouncementContainer>
      <PageHeading>Announcements and Events</PageHeading>
      <AddButton onClick={() => setIsModalOpen({ isModalOpen: true })}>
        <PlusOutlined />
        {ADD_TEXT}
      </AddButton>
      {hasData(storageEvents) && (
        <SectionContainer>
          <Alert message="Your following announcements/events are waiting for approval" type="info" />
          {storageEvents.map(({ uid, ...rest }) => (
            <StorageCard key={uid} {...rest} />
          ))}
        </SectionContainer>
      )}
      <SectionContainer>{loading ? <Loader /> : <DisplayEvents events={events} />}</SectionContainer>
      <StyledModal open={isModalOpen} title={ADD_TEXT} footer={null} width={800} onCancel={onCancel}>
        <AnnouncementForm onCancel={onCancel} setStorageEvents={setStorageEvents} />
      </StyledModal>
    </AnnouncementContainer>
  );
}

export default AnnouncementsPage;
