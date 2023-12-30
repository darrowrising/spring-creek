import styled from 'styled-components';
import { shape, string } from 'prop-types';

import AnnouncementCard from '../../components/Announcement';
import { MonthHeading } from '../../components/Heading';
import { utc } from '../../utils/date.utils';
import { isEmpty } from '../../utils/data.utils';
import { dateShort } from '../../configs/dateFormats';

const Card = ({ event }) => {
  const { startDate } = event;

  return (
    <div>
      <StartDate>{startDate && `starts on ${utc({ date: startDate, format: dateShort })}`}</StartDate>
      <AnnouncementCard event={event} />
    </div>
  );
};

Card.propTypes = {
  event: shape({
    startDate: string,
    uid: string,
  }),
};

const StartDate = styled.div`
  font-size: 0.8em;
  color: var(--color-black-2);
  padding: 0 var(--space-2) var(--space-2) 0;
  display: flex;
  justify-content: flex-end;
`;

function DisplayEvents({ events = [] }) {
  if (isEmpty(events)) return null;

  return Object.entries(events).map(([month, monthEvents]) => (
    <div key={month}>
      <MonthHeading>{month}</MonthHeading>
      {monthEvents && monthEvents.map((event) => <Card key={event.uid} event={event} />)}
    </div>
  ));
}

DisplayEvents.propTypes = {
  events: shape(),
};

export default DisplayEvents;
