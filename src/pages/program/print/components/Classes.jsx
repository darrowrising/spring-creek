// import {} from 'react';
import styled from 'styled-components';
import { shape } from 'prop-types';

import Heading from '../../../../components/Heading';
import { dayjs } from '../../../../utils/date.utils';
import { dateLong, dateLongTime } from '../../../../configs/dateFormats';
import classSchedule from '../../../../configs/classSchedule';

// #region styles
const Center = styled.div`
  align-items: center;
  display: flex;
  /* justify-content: space-between; */
  height: 100%;
  text-align: center;
  flex-direction: column;
  gap: var(--space-4);

  .ant-qrcode {
    border: none;
  }
`;

const Header = styled.header`
  padding-top: 10%;
`;

const Date = styled.div`
  font-size: 0.8em;
  padding-top: var(--space-2);
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
  font-size: 0.8em;
  width: 60%;
`;

const SubHeading = styled.h2`
  font-size: 1em;
  margin-bottom: -10px;
`;

const Title = styled.h3`
  font-size: 1em;
  padding-top: var(--space-4);
  /* font-weight: normal; */
`;

const Group = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-1);
  border-bottom: 1px solid var(--color-grey-2);
`;

const Name = styled.span``;

const Room = styled.span``;

const Teachers = styled.div`
  font-size: 0.8em;
`;
// #endregion styles

// #region main
function Classes({ data = {} }) {
  const { date = '' } = data;
  const updatedDate = dayjs(date, dateLongTime).format(dateLong);

  return (
    <Center>
      <Header>
        <Heading>Spring Creek Ward</Heading>
        <Date>{updatedDate}</Date>
      </Header>
      <SubHeading>Second Hour Classes</SubHeading>
      <Grid>
        {classSchedule.map(({ title, classes }) => (
          <>
            <Title>{title}</Title>
            {classes.map(({ name, room, teachers }) => (
              <div>
                <Group>
                  <Name>{name}</Name>
                  <Room>Room: {room}</Room>
                </Group>
                <Teachers>Teachers: {teachers.join(', ')}</Teachers>
              </div>
            ))}
          </>
        ))}
      </Grid>
    </Center>
  );
}

Classes.propTypes = {
  data: shape(),
};

// #endregion main
export default Classes;
