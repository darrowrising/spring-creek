import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Popconfirm, Drawer } from 'antd';

import Loader from '../../../components/Loader';
import Announcement from '../../../components/Announcement';
import EventCard from '../../../components/EventCard';
import Button, { ButtonGroup } from '../../../components/Button';
import { SubHeading } from '../../../components/Heading';
import { useAdminContext } from '../../../providers/admin.provider';
import { useUser } from '../../../providers/user.provider';
import { utc } from '../../../utils/date.utils';
import { db } from '../../../utils/firebase.utils';
import AnnouncementForm from '../../announcements/Form';
import { approveSlideOut } from '../../../styles/animations';
import { media } from '../../../styles/variables';

const Page = styled.div``;

const SectionHeading = styled(SubHeading)`
  padding-bottom: var(--space-4);

  ${media.tablet} {
    font-size: 1.6rem;
    padding-bottom: var(--space-3);
  }
`;

const Empty = styled.div``;

const EXIT_ANIMATION_MS = 400;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const Wrapper = styled.div`
  background-color: var(--color-grey-3);
  padding: var(--space-4);
  overflow: hidden;

  ${media.tablet} {
    padding: var(--space-3);
  }

  ${({ $isExiting }) =>
    $isExiting &&
    css`
      animation: ${approveSlideOut} ${EXIT_ANIMATION_MS}ms ease forwards;
      pointer-events: none;
    `}

  & > ${ButtonGroup} {
    margin-top: var(--space-4);

    ${media.tablet} {
      margin-top: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
  }
`;

const PreviewSection = styled.section`
  & + & {
    margin-top: var(--space-4);
  }
`;

const PreviewTitle = styled.h4`
  color: var(--color-brown-1);
  font-size: 0.9em;
  font-weight: normal;
  margin: 0;
  padding-bottom: var(--space-1);
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

const EDIT_TEXT = 'Edit an Announcement or Event';

function Moderation() {
  const [eventToEdit, setEventToEdit] = useState(null);
  const [exitingUids, setExitingUids] = useState(() => new Set());
  const { announcements = [], loading } = useAdminContext();
  const {
    user: { displayName },
  } = useUser();

  const isDrawerOpen = Boolean(eventToEdit?.uid);

  useEffect(() => {
    setExitingUids((prev) => {
      const next = new Set([...prev].filter((uid) => announcements.some((event) => event.uid === uid)));

      if (next.size === prev.size) return prev;

      return next;
    });
  }, [announcements]);

  const startExit = (eventUid) => {
    setExitingUids((prev) => new Set(prev).add(eventUid));
  };

  const handleApprove = (eventUid) => {
    startExit(eventUid);

    window.setTimeout(() => {
      db.collection('announcements').doc(eventUid).update({
        approvedBy: displayName,
        approvedOn: utc(),
        moderate: false,
      });
    }, EXIT_ANIMATION_MS);
  };

  const handleDelete = (eventUid) => {
    startExit(eventUid);

    window.setTimeout(() => {
      db.collection('announcements').doc(eventUid).delete();
    }, EXIT_ANIMATION_MS);
  };

  const onClose = () => setEventToEdit(null);

  const handleEdit = (event) => setEventToEdit(event);

  if (loading) return <Loader />;
  return (
    <Page>
      <SectionHeading>Announcements/Events</SectionHeading>
      <Grid>
        {announcements.length ? (
          announcements.map((event) => (
            <Wrapper key={event.uid} $isExiting={exitingUids.has(event.uid)}>
              <PreviewSection>
                <PreviewTitle>Sacrament Program Preview</PreviewTitle>
                <EventCard event={event} />
              </PreviewSection>
              <PreviewSection>
                <PreviewTitle>Website Announcement Preview</PreviewTitle>
                <Announcement event={event} />
              </PreviewSection>
              <ButtonGroup>
                <Button color="green" disabled={exitingUids.has(event.uid)} onClick={() => handleApprove(event.uid)}>
                  Approve
                </Button>
                <Button disabled={exitingUids.has(event.uid)} onClick={() => handleEdit(event)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure?"
                  description="This cannot be undone"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(event.uid)}
                >
                  <Button color="red" disabled={exitingUids.has(event.uid)}>
                    Delete
                  </Button>
                </Popconfirm>
              </ButtonGroup>
            </Wrapper>
          ))
        ) : (
          <Empty>Nothing to moderate at this time</Empty>
        )}
      </Grid>
      <StyledDrawer destroyOnHidden open={isDrawerOpen} title={EDIT_TEXT} size={700} onClose={onClose}>
        <AnnouncementForm
          key={eventToEdit?.uid}
          event={eventToEdit ?? {}}
          isModeratorEdit
          onCancel={onClose}
        />
      </StyledDrawer>
    </Page>
  );
}

export default Moderation;
