import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { shape, string, oneOfType } from 'prop-types';
import { QRCode } from 'antd';

import Heading, { SubHeading } from '../../../../components/Heading';
import { db, docs } from '../../../../utils/firebase.utils';
import { groupByDate, sortEvents, hasData } from '../../../../utils/data.utils';
import { utc, dayjs, comingSunday, isBetween } from '../../../../utils/date.utils';
import { transferEvents } from './temp';
// import { getOrganizationColor } from '../../../../utils/organizations.utils';
import { dateLong, dateLongTime, time as timeFormat, programIdShort } from '../../../../configs/dateFormats';
import config from '../../../temp/initiative/config';

const TRANSFER_EVENTS = false;

if (TRANSFER_EVENTS) transferEvents();

// #region Details
const DetailsLayout = styled.div``;

const Group = styled.h5`
  /* background-color: ${({ $color }) => $color}; */
  background-color: var(--color-grey-2);
  padding: var(--space-1);
  font-size: 0.6em;
  color: var(--color-black-2);
  text-align: left;
  text-indent: var(--space-3);
`;

const Content = styled.div`
  display: grid;
  /* justify-content: space-between; */
  grid-template-columns: auto 40px;
  padding: var(--space-3);
  text-align: left;
`;

const Title = styled.h6`
  font-weight: normal;
  font-size: 0.8em;
`;

const Time = styled.span`
  font-size: 0.6em;
  color: var(--color-black-2);
`;

const QRGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .ant-qrcode {
    padding: 0;

    ${({ $qrSize }) => css`
      width: calc(${$qrSize}px - 20px) !important;
      height: calc(${$qrSize}px - 20px) !important;
    `}
  }
`;
const QRTitle = styled.span`
  font-size: 0.6em;
  color: var(--color-black-2);
`;

const PrintMessage = styled.div`
  font-size: 0.6em;
  max-width: 300px;
  padding-top: var(--space-1);
`;

function Details({ group, title, time, qrLink, qrTitle, qrSize = 60, printMessage }) {
  return (
    <DetailsLayout>
      <Group>{group}</Group>
      <Content>
        <div>
          <Title>{title}</Title>
          {time && <Time>@ {utc({ date: time, format: timeFormat })}</Time>}
          {printMessage && <PrintMessage>{printMessage}</PrintMessage>}
        </div>
        {qrLink && (
          <QRGroup $qrSize={qrSize}>
            {qrTitle && <QRTitle>{qrTitle}</QRTitle>}
            <QRCode size={qrSize} value={qrLink} />
          </QRGroup>
        )}
      </Content>
    </DetailsLayout>
  );
}

Details.propTypes = {
  group: string,
  title: string,
  time: string,
  qrLink: string,
  qrTitle: string,
  printMessage: oneOfType(string, shape()),
};
// #endregion Details

// #region EventDate
const DateLayout = styled.dl`
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-5);
`;

const WeekDay = styled.dd`
  font-size: 0.8em;
  text-transform: uppercase;
  color: var(--color-grey-1);
`;

const Day = styled.dd`
  font-size: 1.2em;
`;

const Month = styled.dd`
  font-size: 0.8em;
  text-transform: uppercase;
  color: var(--color-grey-1);
  font-weight: 500;
`;

function EventDate({ date }) {
  return (
    <DateLayout>
      <WeekDay>{utc({ date, format: 'ddd' })}</WeekDay>
      <Day>{utc({ date, format: 'DD' })}</Day>
      <Month>{utc({ date, format: 'MMM' })}</Month>
    </DateLayout>
  );
}

EventDate.propTypes = {
  date: string,
};
// #endregion EventDate

// #region Date Group
const DateGroupLayout = styled.div`
  align-items: center;
  display: flex;
  border-right: 1px solid var(--color-border-print);
  /* background-color: var(--color-white-2); */
`;

const Multiple = styled.span`
  /* padding: 0 var(--space-2); */
  font-size: 2em;
  color: var(--color-grey-1);
`;

function DateGroup({ startDate, endDate }) {
  return (
    <DateGroupLayout>
      {startDate && <EventDate date={startDate} />}
      {startDate && endDate && <Multiple>&#8250;</Multiple>}
      {endDate && <EventDate date={endDate} />}
    </DateGroupLayout>
  );
}

DateGroup.propTypes = {
  startDate: string,
  endDate: string,
};
// #endregion Date Group

// #region Card
const CardLayout = styled.div`
  border: 1px solid var(--color-border-print);
  border-radius: var(--space-1);
  display: grid;
  grid-template-columns: min-content 1fr;
  /* box-shadow: var(--elevation-3); */
  overflow: hidden;
`;

function Card({ event }) {
  const { startDate, endDate, time, group, title, qrLink, qrTitle, qrSize, printMessage } = event;

  return (
    <CardLayout>
      <DateGroup startDate={startDate} endDate={endDate} time={time} />
      <Details
        group={group}
        title={title}
        time={time}
        qrLink={qrLink}
        qrTitle={qrTitle}
        qrSize={qrSize}
        printMessage={printMessage}
      />
    </CardLayout>
  );
}

Card.propTypes = {
  event: shape(),
};
// #endregion Card

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

// eslint-disable-next-line
let unsubscribe;

function Events({ data }) {
  const [events, setEvents] = useState([]);

  const { date } = data;
  const updatedDate = dayjs(date, dateLongTime).format(dateLong);

  useEffect(() => {
    unsubscribe = db
      .collection('announcements')
      .orderBy('endDate')
      .limit(7)
      .onSnapshot((snap) => {
        const eventsData = docs(snap) || [];

        const groupedData = sortEvents(eventsData)
          .filter(({ endDate }) => {
            const eventDate = utc({ date: endDate, format: programIdShort });
            const sunday = utc({ date: comingSunday(), format: programIdShort });

            return eventDate >= sunday;
          })
          .flatMap((event) => {
            if (event.title === 'Ward Christmas Party') {
              return {
                ...event,
                time: '1899-12-31T17:00:00-08:00',
              };
            }
            if (event.title === 'Neighborhood Nativity Night') {
              return {
                ...event,
                qrLink: 'https://www.signupgenius.com/go/20F0E4AAFAB2FABFF2-46093761-neighborhood#/',
                qrTitle: 'sign up',
              };
            }
            if (event.title === 'Tithing Declaration') {
              return {
                ...event,
                qrLink: 'https://calendly.com/springcreek/tithing-declaration',
                qrTitle: 'sign up',
              };
            }
            if (event.title === 'Temple and Family History 2024 Initiative') {
              const currentWeekIndex = 0;
              // const currentWeekIndex = config.findIndex(({ startDate, endDate }) =>
              //   isBetween({ start: startDate, end: endDate })
              // );

              const currentWeek = config[currentWeekIndex];
              const nextWeek = config[currentWeekIndex + 1];
              const thirdWeek = config[currentWeekIndex + 2];

              return [
                {
                  ...event,
                  qrLink: `https://www.springcreekward.com/temple-family-history-initiative#week-${currentWeek.weekNumber}`,
                  qrTitle: 'For Info',
                  qrSize: 65,
                  printMessage: (
                    <div>
                      <span>Week {currentWeek.weekNumber}: </span>
                      {currentWeek.objective}
                    </div>
                  ),
                  startDate: '',
                  endDate: utc({ date: currentWeek.endDate }),
                },
                {
                  ...event,
                  qrLink: `https://www.springcreekward.com/temple-family-history-initiative#week-${nextWeek.weekNumber}`,
                  qrTitle: 'For Info',
                  qrSize: 65,
                  printMessage: (
                    <div>
                      <span>Week {nextWeek.weekNumber}: </span>
                      {nextWeek.objective}
                    </div>
                  ),
                  startDate: '',
                  endDate: utc({ date: nextWeek.endDate }),
                  uid: `2-${event.uid}`,
                },
                {
                  ...event,
                  qrLink: `https://www.springcreekward.com/temple-family-history-initiative#week-${thirdWeek.weekNumber}`,
                  qrTitle: 'For Info',
                  qrSize: 65,
                  printMessage: (
                    <div>
                      <span>Week {thirdWeek.weekNumber}: </span>
                      {thirdWeek.objective}
                    </div>
                  ),
                  startDate: '',
                  endDate: utc({ date: thirdWeek.endDate }),
                  uid: `3-${event.uid}`,
                },
              ];
            }
            return event;
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
        <EventsGrid>{hasData(events) && events.map((event) => <Card key={event.uid} event={event} />)}</EventsGrid>
      </div>
      <SubmitInfo>
        <Instructions>
          Submit announcements at <em>springcreekward.com/announcements</em>
          <br /> or text Ben Ellis 801-721-0844
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
