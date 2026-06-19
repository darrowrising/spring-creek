import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { shape } from 'prop-types';
import { QRCode } from 'antd';

import Heading from '../../../../components/Heading';
import { db, docs } from '../../../../utils/firebase.utils';
import { sortEvents, hasData } from '../../../../utils/data.utils';
import { utc, dayjs, comingSunday } from '../../../../utils/date.utils';
import { dateLong, dateLongTime, programIdShort } from '../../../../configs/dateFormats';
import EventCard from '../../../../components/EventCard';

// #region Print Events
const Center = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 100%;
  text-align: center;
  flex-direction: column;

  .ant-qrcode {
    border: none;
  }
`;

const Header = styled.header`
  padding-top: 10%;
`;

// const Topic = styled.div`
//   font-size: 1.2em;
//   padding-bottom: 1.5em;
//   font-weight: 100;
// `;

const Date = styled.div`
  font-size: 0.8em;
  padding-top: var(--space-2);
`;

// const MonthHeading = styled(SubHeading)`
//   text-align: left;
//   text-indent: var(--space-6);
//   padding-bottom: var(--space-2);
// `;

const EventsHeading = styled.h3`
  font-size: 1em;
  padding-bottom: var(--space-4);
`;

const EventsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  /* padding-bottom: var(--space-4); */
  min-width: 400px;
`;

const SubmitInfo = styled.section`
  display: flex;
  align-items: center;
  /* gap: var(--space-4); */
  text-align: left;
  color: var(--color-grey-1);
  line-height: 1.1em;

  & > em {
    color: var(--color-primary);
  }
`;

const Instructions = styled.div`
  font-size: 0.8em;
`;

const Quote = styled.blockquote`
  & > p {
    background: red;

    &::before {
      content: '\201C';
    }
    &::after {
      content: '\201D';
    }
  }
`;

// eslint-disable-next-line
let unsubscribe;

function Events({ data = [] }) {
  const [events, setEvents] = useState([]);

  const { date } = data;
  const updatedDate = dayjs(date, dateLongTime).format(dateLong);
  const [note, author] = data.note?.split('--') ?? [];

  useEffect(() => {
    unsubscribe = db
      .collection('announcements')
      .where('moderate', '==', false)
      .orderBy('endDate')
      .limit(5)
      .onSnapshot((snap) => {
        const eventsData = docs(snap) || [];

        const groupedData = sortEvents(eventsData).filter(({ endDate }) => {
          const eventDate = utc({ date: endDate, format: programIdShort });
          const sunday = utc({ date: comingSunday(), format: programIdShort });

          return eventDate >= sunday;
        });

        setEvents(groupedData);
      });
    return () => unsubscribe();
  }, []);

  return (
    <Center>
      <Header>
        <Heading>Spring Creek Ward</Heading>
        <Date>{updatedDate}</Date>
      </Header>
      <div>
        <EventsHeading>Upcoming Events</EventsHeading>
        <EventsGrid>{hasData(events) && events.map((event) => <EventCard key={event.uid} event={event} />)}</EventsGrid>
      </div>
      {note && (
        <Quote>
          <p>{note}</p>
          {author && <footer>-- {author}</footer>}
        </Quote>
      )}
      <SubmitInfo>
        <Instructions>
          Submit announcements at <em>springcreekward.com/announcements</em>
          <br /> or text Josh Dyreng (801) 859-2034
        </Instructions>
        <QRCode size={60} value="https://springcreekward.com/announcements" />
      </SubmitInfo>
    </Center>
  );
}

Events.propTypes = {
  data: shape(),
};

export default Events;
// #endregion Print Events
