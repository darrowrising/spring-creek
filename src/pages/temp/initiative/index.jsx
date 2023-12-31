import styled from 'styled-components';
import { Badge } from 'antd';

import { PageHeading } from '../../../components/Heading';
import { isBetween, isAfter } from '../../../utils/date.utils';
import { colorOrange2 } from '../../../styles/variables';

import WeekCard from './WeekCard';
import config from './config';

// #region main styles
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
`;
// #endregion main styles

// #region main
function initiative() {
  return (
    <div>
      <PageHeading>Temple and Family History 2024 Initiative</PageHeading>
      <Content>
        {config.map(({ startDate, endDate, days, ...rest }) => {
          const isCurrentWeek = isBetween({ start: startDate, end: endDate });
          const isPassed = isAfter(endDate);

          if (isCurrentWeek)
            return (
              <Badge.Ribbon text="Active Week" color={colorOrange2} key={days}>
                <WeekCard isCurrentWeek={isCurrentWeek} days={days} {...rest} />
              </Badge.Ribbon>
            );

          return <WeekCard isCurrentWeek={isCurrentWeek} isPassed={isPassed} days={days} {...rest} key={days} />;
        })}
      </Content>
    </div>
  );
}
// #endregion main
export default initiative;
