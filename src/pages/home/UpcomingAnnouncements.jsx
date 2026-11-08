import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

import Link from '../../components/Link';
import Loader from '../../components/Loader';
import { db, docs } from '../../utils/firebase.utils';
import {
  formatAnnouncementDateLabel,
  getUpcomingWithinWeeks,
} from '../../utils/announcements.utils';
import { getOrganizationColor } from '../../utils/organizations.utils';
import { hasData } from '../../utils/data.utils';
import { GAEvent } from '../../components/Analytics';

const Section = styled.section`
  margin-top: var(--space-10);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-3);
`;

const HeadingBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25em;
  color: var(--color-black-2);
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--color-grey-1);
  font-size: 0.9em;
`;

const AddLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px dashed var(--color-grey-2);
  border-radius: 4px;
  background: var(--color-grey-3);
  color: var(--color-black-2);
  font-size: 0.85em;
  text-decoration: none;

  &&:hover {
    color: var(--color-black-2);
    text-decoration: none;
    opacity: 0.85;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const Item = styled.li``;

const ItemLink = styled(Link)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: start;
  padding: var(--space-4);
  border: 1px solid var(--color-grey-3);
  border-radius: 6px;
  background: var(--color-white-1);
  color: inherit;
  text-decoration: none;

  &&:hover {
    color: inherit;
    text-decoration: none;
    border-color: var(--color-blue-3);
  }
`;

const Group = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  background: ${({ $group }) => getOrganizationColor($group)};
  color: var(--color-white-1);
  font-size: 10px;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: var(--color-black-2);
`;

const ItemDate = styled.div`
  font-size: 0.85em;
  color: var(--color-grey-1);
`;

const Empty = styled.div`
  padding: var(--space-6);
  border: 1px dashed var(--color-grey-2);
  border-radius: 6px;
  background: var(--color-grey-3);
  color: var(--color-grey-1);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
`;

const FooterLink = styled(Link)`
  font-size: 0.9em;
`;

const track = (label) => {
  GAEvent({
    category: 'User',
    action: 'Home Upcoming Clicked',
    label,
  });
};

function UpcomingAnnouncements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection('announcements')
      .where('moderate', '==', false)
      .onSnapshot((snap) => {
        const data = docs(snap) ?? [];
        setEvents(getUpcomingWithinWeeks(data, 4));
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <Section>
      <Header>
        <HeadingBlock>
          <Title>Coming up</Title>
          <Subtitle>Announcements and events for the next 4 weeks</Subtitle>
        </HeadingBlock>
        {!loading && hasData(events) && (
          <AddLink to="/announcements?create=1" onClick={() => track('add')}>
            <PlusOutlined />
            Add an announcement
          </AddLink>
        )}
      </Header>

      {loading && <Loader />}

      {!loading && !hasData(events) && (
        <Empty>
          <div>Nothing scheduled for the next 4 weeks yet.</div>
          <AddLink to="/announcements?create=1" onClick={() => track('add-empty')}>
            <PlusOutlined />
            Add an announcement
          </AddLink>
        </Empty>
      )}

      {!loading && hasData(events) && (
        <>
          <List>
            {events.map((event) => (
              <Item key={event.uid}>
                <ItemLink to="/announcements" onClick={() => track('item')}>
                  {event.group ? <Group $group={event.group}>{event.group}</Group> : null}
                  <ItemBody>
                    <ItemTitle>{event.title}</ItemTitle>
                    <ItemDate>{formatAnnouncementDateLabel(event)}</ItemDate>
                  </ItemBody>
                </ItemLink>
              </Item>
            ))}
          </List>
          <FooterLink to="/announcements" onClick={() => track('see-all')}>
            See all announcements
          </FooterLink>
        </>
      )}
    </Section>
  );
}

export default UpcomingAnnouncements;
