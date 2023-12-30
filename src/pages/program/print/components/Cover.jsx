import styled from 'styled-components';
import { shape, string } from 'prop-types';

import Heading from '../../../../components/Heading';
import coverImg from '../../../../assets/covers/jesusKids.jpg';
import { dayjs } from '../../../../utils/date.utils';
import { dateLong, dateLongTime } from '../../../../configs/dateFormats';

const CoverContainer = styled.div`
  align-items: center;
  display: grid;
  justify-content: center;
  height: 100%;
  text-align: center;
`;

const Topic = styled.div`
  font-size: 1.2em;
  padding-bottom: 1.5em;
  font-weight: 100;
`;
const Date = styled.div`
  font-size: 0.8em;
  padding-top: var(--space-2);
`;
const CoverImage = styled.img`
  max-height: 500px;
`;
const SubText = styled.div`
  font-size: 0.8em;
  color: var(--color-grey-2);
`;

function Cover({ program: { date, topic } }) {
  const updatedDate = dayjs(date, dateLongTime).format(dateLong);

  return (
    <CoverContainer>
      <div>
        <Heading>Spring Creek Ward</Heading>
        <Date>{updatedDate}</Date>
      </div>
      <div>
        {topic && <Topic>{topic}</Topic>}
        <CoverImage src={coverImg} alt="Jesus with Kids" />
        <SubText>Color Me</SubText>
      </div>
    </CoverContainer>
  );
}

Cover.propTypes = {
  program: shape({
    topic: string,
    date: string.isRequired,
  }),
};

export default Cover;
