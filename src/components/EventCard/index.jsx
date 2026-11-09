import styled, { css } from 'styled-components';
import { number, oneOfType, shape, string } from 'prop-types';
import { QRCode } from 'antd';

import { dayjs, utc } from '../../utils/date.utils';
import { normalizeUrl } from '../../utils/url.utils';

// #region EventDate
const DateLayout = styled.dl`
  display: flex;
  flex-direction: column;
  padding: var(--space-2) var(--space-3);
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
  flex: 1;
`;

const Multiple = styled.span`
  font-size: 2em;
  color: var(--color-grey-1);
`;

function DateGroup({ startDate, endDate }) {
  const hasRange = Boolean(startDate && endDate) && !dayjs(startDate).isSame(dayjs(endDate), 'day');
  const singleDate = endDate || startDate;

  if (hasRange) {
    return (
      <DateGroupLayout>
        <EventDate date={startDate} />
        <Multiple>&#8250;</Multiple>
        <EventDate date={endDate} />
      </DateGroupLayout>
    );
  }

  return <DateGroupLayout>{singleDate && <EventDate date={singleDate} />}</DateGroupLayout>;
}

DateGroup.propTypes = {
  startDate: string.isRequired,
  endDate: string.isRequired,
};
// #endregion Date Group

// #region Details
const Group = styled.h5`
  background-color: var(--color-grey-2);
  padding: var(--space-1);
  font-size: 0.6em;
  color: var(--color-black-2);
  text-align: left;
  text-indent: var(--space-3);
  margin: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
`;

const Title = styled.h6`
  font-weight: normal;
  font-size: 0.8em;
  margin: 0;
  flex: 1;
  min-width: 0;
  word-break: break-word;
`;

const Time = styled.span`
  font-size: 0.6em;
  color: var(--color-black-2);
  flex-shrink: 0;
  margin-left: auto;
  text-align: right;
  white-space: nowrap;
`;

const Description = styled.div`
  font-size: 0.6em;
  padding-top: var(--space-1);
`;

const TextContent = styled.div`
  padding: var(--space-3);
  text-align: left;
  min-width: 0;
`;

const DetailsPanel = styled.div`
  grid-column: 2;
  grid-row: 1 / -1;
  display: grid;
  grid-template-rows: auto 1fr;
  min-width: 0;
`;

const QRGroup = styled.div`
  grid-column: 3;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  border-left: 1px solid var(--color-border-print);
  padding: var(--space-2);

  .ant-qrcode {
    padding: 0;

    ${({ $qrSize }) => css`
      width: ${$qrSize}px !important;
      height: ${$qrSize}px !important;
    `}
  }
`;

const QRTitle = styled.span`
  font-size: 0.6em;
  color: var(--color-black-2);
`;

function EventText({ title, time, description }) {
  return (
    <TextContent>
      <TitleRow>
        <Title>{title}</Title>
        {time && <Time>@ {time}</Time>}
      </TitleRow>
      {description && <Description>{description}</Description>}
    </TextContent>
  );
}

EventText.propTypes = {
  title: string,
  time: string,
  description: oneOfType([string, shape()]),
};

function EventQr({ qrLink, qrTitle, qrSize = 60 }) {
  return (
    <QRGroup $qrSize={qrSize}>
      {qrTitle && <QRTitle>{qrTitle}</QRTitle>}
      <QRCode size={qrSize} value={normalizeUrl(qrLink)} />
    </QRGroup>
  );
}

EventQr.propTypes = {
  qrLink: string.isRequired,
  qrTitle: string,
  qrSize: number,
};
// #endregion Details

// #region EventCard
const CardLayout = styled.div`
  background-color: var(--color-white-1);
  border: 1px solid var(--color-border-print);
  border-radius: var(--space-1);
  display: grid;
  grid-template-columns: ${({ $hasQr }) => ($hasQr ? 'min-content minmax(0, 1fr) auto' : 'min-content 1fr')};
  align-items: stretch;
  overflow: hidden;
`;

const DateCell = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
`;

export default function EventCard({ event }) {
  const { startDate, endDate, time, group, title, qrLink, qrTitle, qrSize, description } = event;
  const hasQr = Boolean(qrLink);

  return (
    <CardLayout $hasQr={hasQr}>
      <DateCell>
        <DateGroup startDate={startDate} endDate={endDate} />
      </DateCell>
      <DetailsPanel>
        <Group>{group}</Group>
        <EventText title={title} time={time} description={description} />
      </DetailsPanel>
      {hasQr && <EventQr qrLink={qrLink} qrTitle={qrTitle} qrSize={qrSize} />}
    </CardLayout>
  );
}

EventCard.propTypes = {
  event: shape(),
};
// #endregion EventCard
