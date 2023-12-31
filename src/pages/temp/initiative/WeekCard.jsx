import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { lighten, darken } from 'polished';
import { useLocation } from 'react-router-dom';

import { SubHeading } from '../../../components/Heading';
import { hasData } from '../../../utils/data.utils';
import { scrollTo } from '../../../utils/functionality.utils';
import { colorPrimary, colorWhite2, mobileMaxWidth } from '../../../styles/variables';

// #region styles
const weekLogicStyles = ({ $isCurrentWeek, $isPassed }) => {
  if ($isCurrentWeek)
    return css`
      border: 1px solid ${darken(0.1, colorWhite2)};
      background-color: ${lighten(0.6, colorPrimary)};
      box-shadow: var(--elevation-1);
    `;
  else if ($isPassed) {
    return css`
      filter: grayscale(100%);
    `;
  }
};

const Card = styled.div`
  border: 1px solid var(--color-white-2);
  background-color: var(--color-white-2);
  border-radius: var(--space-4);
  padding: var(--space-10);
  font-size: 1.6rem;

  ${weekLogicStyles};

  & > p {
    line-height: 1.5;
  }

  @media screen and (max-width: ${mobileMaxWidth}) {
    padding: var(--space-8) var(--space-4);
  }
`;

const Heading = styled(SubHeading)`
  display: flex;
  justify-content: space-between;
  color: var(--color-orange-1);
`;

const Days = styled.span`
  font-family: var(--font-text);
  font-weight: normal;
  color: var(--color-grey-1);
  font-size: 0.8em;
`;

const FHE = styled.p``;
const Extra = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  line-height: 1.2;

  strong {
    color: var(--color-primary);
    padding-right: var(--space-2);
  }
  span {
    color: var(--color-grey-1);
  }
`;
// #endregion styles

// #region main
function WeekCard({ isCurrentWeek, isPassed, days, weekNumber, objective, fhe, extra }) {
  const { hash } = useLocation();
  const id = `week-${weekNumber}`;

  useEffect(() => {
    if (isCurrentWeek && !hash) scrollTo(id);
  }, [isCurrentWeek]);

  return (
    <Card id={id} $isCurrentWeek={isCurrentWeek} $isPassed={isPassed}>
      <Heading>
        Week {weekNumber}: <Days>{days}</Days>
      </Heading>
      <p>{objective}</p>
      {fhe && <FHE>FHE: {fhe}</FHE>}
      {hasData(extra) && (
        <Extra>
          {extra.map(({ title, text }) => (
            <div key={title}>
              <strong>{title}:</strong>
              <span>{text}</span>
            </div>
          ))}
        </Extra>
      )}
    </Card>
  );
}

// WeekCard.propTypes = {

// };

// #endregion main
export default WeekCard;
