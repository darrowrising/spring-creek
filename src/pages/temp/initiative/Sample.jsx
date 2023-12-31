// import {} from 'react';
import styled from 'styled-components';
// import {} from 'prop-types';

import { isBetween, isAfter } from '../../../utils/date.utils';
import { hasData, isEmpty } from '../../../utils/data.utils';

import config from './config';
import WeekCard from './WeekCard';

const Heading = styled.h3`
  padding-top: var(--space-10);
  padding-bottom: var(--space-5);
  text-align: center;
`;

const SubHeading = styled.h4`
  color: var(--color-grey-1);
  text-indent: 2%;
  padding: var(--space-2) 0;
`;

// #region main
function Sample() {
  const currentWeekIndex = config.findIndex(({ startDate, endDate }) => isBetween({ start: startDate, end: endDate }));
  const currentWeek = config[currentWeekIndex];
  const nextWeek = config[currentWeekIndex + 1];

  if (isAfter('2024-03-20')) return null;

  return (
    <div>
      <Heading>Temple and Family History 2024 Initiative</Heading>
      {hasData(currentWeek) && (
        <>
          <SubHeading>This Week:</SubHeading>
          <WeekCard {...currentWeek} />
        </>
      )}
      {hasData(nextWeek) && (
        <>
          <SubHeading>Next Week:</SubHeading>
          <WeekCard {...nextWeek} />
        </>
      )}
    </div>
  );
}

// Sample.propTypes = {

// };
// #endregion main
export default Sample;
