import styled from 'styled-components';
import { FormOutlined } from '@ant-design/icons';
import { arrayOf, func, shape, string } from 'prop-types';

import AnnouncementCard from '../../components/Announcement';
import { MonthHeading } from '../../components/Heading';
import { utc } from '../../utils/date.utils';
import { hasData, isEmpty } from '../../utils/data.utils';
import { ANNOUNCEMENT_TYPES, resolveAnnouncementType } from '../../utils/announcements.utils';
import { dateShort } from '../../configs/dateFormats';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-4);
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 0 var(--space-2) var(--space-2) 0;
  min-height: 1.5em;
`;

const StartDate = styled.div`
  font-size: 0.8em;
  color: var(--color-black-2);
`;

const EditButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  color: var(--color-grey-1);
  cursor: pointer;
  font-size: 0.95em;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0;
  margin-left: auto;

  &:hover {
    color: var(--color-primary);
  }
`;

const SectionHeading = styled.h2`
  margin: 0 0 var(--space-5);
  font-size: 1.15em;
  color: var(--color-black-2);
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Card = ({ event, onEdit }) => {
  const { startDate, uid } = event;
  const showStartDate = startDate && resolveAnnouncementType(event) === ANNOUNCEMENT_TYPES.EVENT;

  return (
    <CardWrapper>
      <MetaRow>
        {showStartDate && <StartDate>starts on {utc({ date: startDate, format: dateShort })}</StartDate>}
        {onEdit && (
          <EditButton type="button" aria-label="Edit announcement" onClick={() => onEdit(uid)}>
            <FormOutlined />
            Edit
          </EditButton>
        )}
      </MetaRow>
      <AnnouncementCard event={event} />
    </CardWrapper>
  );
};

Card.propTypes = {
  event: shape({
    startDate: string,
    uid: string,
  }),
  onEdit: func,
};

function DisplayEvents({ announcements = [], events = {}, onEdit }) {
  const hasAnnouncements = hasData(announcements);
  const hasEvents = !isEmpty(events);

  if (!hasAnnouncements && !hasEvents) return null;

  return (
    <>
      {hasAnnouncements && (
        <SectionBlock>
          <SectionHeading>Announcements</SectionHeading>
          {announcements.map((event) => (
            <Card key={event.uid} event={event} onEdit={onEdit} />
          ))}
        </SectionBlock>
      )}

      {hasEvents && (
        <SectionBlock>
          <SectionHeading>Events</SectionHeading>
          {Object.entries(events).map(([month, monthEvents]) => (
            <div key={month}>
              <MonthHeading>{month}</MonthHeading>
              {monthEvents && monthEvents.map((event) => <Card key={event.uid} event={event} onEdit={onEdit} />)}
            </div>
          ))}
        </SectionBlock>
      )}
    </>
  );
}

DisplayEvents.propTypes = {
  announcements: arrayOf(shape({ uid: string })),
  events: shape(),
  onEdit: func,
};

export default DisplayEvents;
