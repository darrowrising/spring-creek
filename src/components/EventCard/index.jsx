import styled, { css } from 'styled-components';
import { number, oneOfType, shape, string } from 'prop-types';
import { QRCode } from 'antd';

import { utc } from '../../utils/date.utils';

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
  startDate: string.isRequired,
  endDate: string.isRequired,
};
// #endregion Date Group

// #region Details
const DetailsLayout = styled.div``;

const Group = styled.h5`
  background-color: var(--color-grey-2);
  padding: var(--space-1);
  font-size: 0.6em;
  color: var(--color-black-2);
  text-align: left;
  text-indent: var(--space-3);
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-3);
  text-align: left;

  & > div {
    width: 100%;
  }
`;

const Title = styled.h6`
  font-weight: normal;
  font-size: 0.8em;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
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

const Description = styled.div`
  font-size: 0.6em;
  max-width: 250px;
  padding-top: var(--space-1);
`;

function Details({ group, title, time, qrLink, qrTitle, qrSize = 60, description }) {
  return (
    <DetailsLayout>
      <Group>{group}</Group>
      <Content>
        <div>
          <Row>
            <Title>{title}</Title>
            {time && <Time>@ {time}</Time>}
          </Row>
          {description && <Description>{description}</Description>}
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
  qrSize: number,
  description: oneOfType([string, shape()]),
};
// #endregion Details

// #region EventCard
const CardLayout = styled.div`
  background-color: var(--color-white-1);
  border: 1px solid var(--color-border-print);
  border-radius: var(--space-1);
  display: grid;
  grid-template-columns: min-content 1fr;
  overflow: hidden;
`;

export default function EventCard({ event }) {
  const { startDate, endDate, time, group, title, qrLink, qrTitle, qrSize, description } = event;

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
        description={description}
      />
    </CardLayout>
  );
}

EventCard.propTypes = {
  event: shape(),
};
// #endregion EventCard
