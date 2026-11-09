import styled, { css } from 'styled-components';
import { shape, string, func } from 'prop-types';
import { QRCode } from 'antd';

import { utc } from '../../utils/date.utils';
import { normalizeUrl } from '../../utils/url.utils';
import { getOrganizationColor } from '../../utils/organizations.utils';
import { ANNOUNCEMENT_TYPES, resolveAnnouncementType } from '../../utils/announcements.utils';
import { dateLong } from '../../configs/dateFormats';
import { fadeIn } from '../../styles/animations';

// #region styles
const Container = styled.div`
  display: grid;
  grid-template-columns: ${({ $showDay }) => ($showDay ? '3.5rem 1fr' : '1fr')};
  column-gap: var(--space-2);
  justify-content: center;
`;

const WeekDay = styled.div`
  width: 3.5rem;
  padding: var(--space-6) 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  line-height: 1.15;
`;

const Card = styled.div`
  animation: 0.5s ${fadeIn} ease-out;
  background-color: var(--color-white-1);
  border: 1px solid var(--color-grey-3);
  border-radius: 6px;
  color: var(--color-black-2);
  min-height: 100px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: ${({ onClick }) => (!onClick ? 'default' : 'pointer')};
  transition: all 0.3s ease;

  ${({ onClick }) => {
    if (onClick) {
      return `&:hover {
        box-shadow: 0 0 4px var(--color-blue-3);
      }`;
    }
  }}
`;

const Group = styled.h4`
  background-color: ${({ $group }) => getOrganizationColor($group)};
  color: var(--color-white-1);
  font-size: 10px;
  padding: 5px;
  text-align: left;
  text-indent: 10px;
`;

const Title = styled.h3`
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-1) 0 var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-grey-3);
  font-size: 1em;
  margin: 0;
`;

const Time = styled.span`
  font-weight: 300;
  font-size: 0.8em;
  padding-right: var(--space-2);
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: ${({ $hasQr }) => ($hasQr ? 'auto 1fr' : '1fr')};
  align-items: stretch;
  flex: 1;
`;

const QRCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-3) var(--space-3) var(--space-1) var(--space-1);
  border-right: 1px solid var(--color-grey-3);

  .ant-qrcode {
    padding: 0;

    ${({ $qrSize }) => css`
      width: ${$qrSize}px !important;
      height: ${$qrSize}px !important;
    `}
  }
`;

const QRTitle = styled.span`
  font-size: 0.7em;
  color: var(--color-grey-1);
  padding-bottom: var(--space-1);
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${({ $hasQr }) => $hasQr && 'min-height: 100%;'}
`;

const Message = styled.div`
  flex: ${({ $hasQr }) => ($hasQr ? '1' : '0 1 auto')};
  padding: var(--space-4);
  padding-bottom: 0;

  p {
    margin: var(--space-1) 0;
    line-height: 1.5;
  }
  a {
    color: var(--color-link);
  }
  ul,
  ol {
    margin: var(--space-2) 0;
    padding-left: 1.5em;
    list-style-position: outside;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
  li {
    line-height: 1.5;
    margin: 0.15em 0;
    padding-left: 0.15em;
  }
`;

const WEBSITE_QR_SIZE = 80;

const EndDate = styled.em`
  display: flex;
  justify-content: flex-end;
  color: var(--color-grey-1);
  font-size: 0.6em;
  margin-top: ${({ $hasQr }) => ($hasQr ? 'auto' : '0')};
  padding: var(--space-2) 0 0;

  & > span {
    color: var(--color-primary);
    padding-right: var(--space-1);
  }
`;
// #endregion styles

// #region main
function Announcement({ event = {}, ...rest }) {
  const { group = '', title = '', message = '', endDate = '', time = '', qrLink = '', qrTitle = '' } = event;
  const hasQr = Boolean(qrLink);
  const isAnnouncement = resolveAnnouncementType(event) === ANNOUNCEMENT_TYPES.ANNOUNCEMENT;
  const hasTime = Boolean(time?.trim()) && !isAnnouncement;
  const showDay = Boolean(endDate) && !isAnnouncement;

  return (
    <Container $showDay={showDay}>
      {showDay && (
        <WeekDay>
          <span>{utc({ date: endDate, format: 'ddd' })}</span>
          <span>{utc({ date: endDate, format: 'D' })}</span>
        </WeekDay>
      )}
      <Card {...rest}>
        {group && <Group $group={group}>{group}</Group>}
        <ContentContainer>
          <Title>
            <span>{title || 'Event Title'}</span>
            {hasTime && <Time>{time}</Time>}
          </Title>
          <Body $hasQr={hasQr}>
            {hasQr && (
              <QRCell $qrSize={WEBSITE_QR_SIZE}>
                {qrTitle && <QRTitle>{qrTitle}</QRTitle>}
                <QRCode size={WEBSITE_QR_SIZE} value={normalizeUrl(qrLink)} />
              </QRCell>
            )}
            <TextColumn $hasQr={hasQr}>
              <Message $hasQr={hasQr} dangerouslySetInnerHTML={{ __html: message }} />
              <EndDate $hasQr={hasQr}>
                {endDate && (
                  <>
                    <span>{isAnnouncement ? 'through' : 'ends on'}</span> {utc({ date: endDate, format: dateLong })}
                  </>
                )}
              </EndDate>
            </TextColumn>
          </Body>
        </ContentContainer>
      </Card>
    </Container>
  );
}

Announcement.propTypes = {
  event: shape({
    group: string,
    title: string,
    message: string,
    endDate: string,
    time: string,
    qrLink: string,
    qrTitle: string,
  }).isRequired,
  onClick: func,
};
// #endregion main
export default Announcement;
