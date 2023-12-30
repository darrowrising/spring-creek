import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Popconfirm, Modal } from 'antd';

import Loader from '../../../components/Loader';
import Announcement from '../../../components/Announcement';
import Button, { ButtonGroup } from '../../../components/Button';
import { SubHeading } from '../../../components/Heading';
import { useAdminContext } from '../../../providers/admin.provider';
import { useUser } from '../../../providers/user.provider';
import { utc } from '../../../utils/date.utils';
import { hasData } from '../../../utils/data.utils';
import { db } from '../../../utils/firebase.utils';
import AnnouncementForm from '../../announcements/Form';

const Page = styled.div``;

const SectionHeading = styled(SubHeading)`
  padding-bottom: var(--space-4);
`;

const Empty = styled.div``;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const Wrapper = styled.div`
  background-color: var(--color-grey-3);
  padding: var(--space-4);

  & > ${ButtonGroup} {
    margin-top: var(--space-4);
  }
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

const EVENT_TO_EDIT_INITIAL_STATE = {};

function Moderation() {
  const [eventToEdit, setEventToEdit] = useState(EVENT_TO_EDIT_INITIAL_STATE);
  const { announcements = [], loading } = useAdminContext();
  const {
    user: { displayName },
  } = useUser();

  const isModalOpen = useMemo(() => hasData(eventToEdit), [eventToEdit]);

  const handleApprove = (eventUid) => {
    db.collection('announcements').doc(eventUid).update({
      approvedBy: displayName,
      approvedOn: utc(),
      moderate: false,
    });
  };

  const handleDelete = (eventUid) => {
    db.collection('announcements').doc(eventUid).delete();
  };

  const onCancel = () => setEventToEdit(EVENT_TO_EDIT_INITIAL_STATE);

  if (loading) return <Loader />;
  return (
    <Page>
      <SectionHeading>Announcements/Events</SectionHeading>
      <Grid>
        {announcements.length ? (
          announcements.map((event) => (
            <Wrapper key={event.uid}>
              <Announcement event={event} />
              <ButtonGroup>
                <Button color="green" onClick={() => handleApprove(event.uid)}>
                  Approve
                </Button>
                <Button disabled>Edit</Button>
                <Popconfirm
                  title="Are you sure?"
                  description="This cannot be undone"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(event.uid)}
                >
                  <Button color="red">Delete</Button>
                </Popconfirm>
              </ButtonGroup>
            </Wrapper>
          ))
        ) : (
          <Empty>Nothing to moderate at this time</Empty>
        )}
      </Grid>
      <StyledModal open={isModalOpen} title="Edit Event" footer={null} width={800} onCancel={onCancel}>
        <AnnouncementForm destroyOnClose event={eventToEdit} onCancel={onCancel} />
      </StyledModal>
    </Page>
  );
}

export default Moderation;
