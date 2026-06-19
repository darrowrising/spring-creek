import styled, { keyframes, css } from 'styled-components';
import { shape, string, func } from 'prop-types';
import { QRCode } from 'antd';
// import { DoubleRightOutlined } from '@ant-design/icons';
import { lighten } from 'polished';

import { utc } from '../../utils/date.utils';
import { normalizeUrl } from '../../utils/url.utils';
import { getOrganizationColor } from '../../utils/organizations.utils';
import { dateLong } from '../../configs/dateFormats';
import { fadeIn } from '../../styles/animations';
import { colorBlue1 } from '../../styles/variables';

// #region styles
const linkTo = keyframes`
  0% { left: 0; }
  25% { left: 3px; }
  50% { left: 0; }
  75% { left: -1px; }
  100% { left: 0; }`;

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(min-content, 30px) 1fr;
  justify-content: center;
`;

const WeekDay = styled.div`
  padding: var(--space-6) var(--space-3) 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Edit = styled.div`
  /* position: absolute;
  right: 0; */

  &:hover {
    background-color: ${lighten(0.3, colorBlue1)};
    color: var(--color-white-1);

    svg {
      animation-duration: 0.5s;
      animation-iteration-count: 2;
      animation-name: ${linkTo};
      left: 0;
      position: relative;
    }
  }
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
  ul {
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-inline-start: var(--space-10);
  }
  li {
    line-height: 1.5;
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
  const hasTime = Boolean(time?.trim());

  return (
    <Container>
      <WeekDay>
        {endDate && (
          <>
            <span>{utc({ date: endDate, format: 'ddd' })}</span>
            <span>{utc({ date: endDate, format: 'D' })}</span>
          </>
        )}
      </WeekDay>
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
                    <span>ends on</span> {utc({ date: endDate, format: dateLong })}
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
