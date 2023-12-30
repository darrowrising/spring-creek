import styled, { keyframes } from 'styled-components';
import { shape, string, func } from 'prop-types';
import { useNavigate } from 'react-router-dom';
// import { DoubleRightOutlined } from '@ant-design/icons';
import { lighten } from 'polished';

import { utc } from '../../utils/date.utils';
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: var(--space-1) 0 var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-grey-3);
  justify-content: space-between;
  font-size: 1em;
  /* position: relative; */
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
  justify-self: flex-end;
  font-weight: 300;
  font-size: 0.8em;
  padding-right: var(--space-2);
`;

const ContentContainer = styled.div`
  padding: var(--space-2);
`;

const Message = styled.div`
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

const EndDate = styled.em`
  display: flex;
  justify-content: flex-end;
  color: var(--color-grey-1);
  font-size: 0.6em;

  & > span {
    color: var(--color-primary);
    padding-right: var(--space-1);
  }
`;
// #endregion styles

// #region main
function Announcement({ event = {}, ...rest }) {
  const { group = '', title = '', message = '', endDate = '', time = '', uid } = event;
  const navigate = useNavigate();
  // const isRange = event?.startDate && event?.endDate;
  // const dayOfWeek = event?.startDate || event?.endDate || event?.date;
  // const dayOfWeekContent = isRange ? 'From' : moment(dayOfWeek, dateFormats.utc).format(dateFormats.dayOfWeek);

  return (
    <Container>
      <WeekDay>
        <span>{utc({ date: endDate, format: 'ddd' })}</span>
        <span>{utc({ date: endDate, format: 'D' })}</span>
      </WeekDay>
      <Card {...rest}>
        {group && <Group $group={group}>{group}</Group>}
        <ContentContainer>
          <Title>
            {title || 'Event Title'}
            {time && <Time>{time}</Time>}
            {/* <Edit onClick={() => navigate(`${uid}`)}>
              <DoubleRightOutlined />
            </Edit> */}
          </Title>
          <Message dangerouslySetInnerHTML={{ __html: message }} />
          <EndDate>
            {endDate && (
              <>
                <span>ends on</span> {utc({ date: endDate, format: dateLong })}
              </>
            )}
          </EndDate>
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
  }).isRequired,
  onClick: func,
};
// #endregion main
export default Announcement;
