import React from 'react';
import styled from 'styled-components';
import { shape, string } from 'prop-types';
import theme from 'theme';

import Heading from '../../components/Heading';
import coverImg from '../../../images/jesusKids.jpg';

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
`;
const Date = styled.div`
  font-size: 1.2em;
`;
const CoverImage = styled.img`
  max-height: 500px;
`;
const SubText = styled.div`
  color: ${theme('color_grey_2')};
`;

const Cover = ({ program: { date, topic } }) => (
  <CoverContainer>
    <div>
      <Heading>Spring Creek Ward</Heading>
      <Date>{date}</Date>
    </div>
    <div>
      {topic && <Topic>{topic}</Topic>}
      <CoverImage src={coverImg} alt="Jesus with Kids" />
      <SubText>Color Me</SubText>
    </div>
  </CoverContainer>
);

Cover.propTypes = {
  program: shape({
    topic: string,
    date: string.isRequired,
  }),
};

Cover.defaultProps = {
  program: {
    topic: '',
  },
};

export default Cover;
