import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import theme from 'theme';

import Heading from '../../../components/Heading';
import { store, docs } from '../../../utils/firebase.utils';

import { questionsPropTypes } from './propTypes';

const StyledHeading = styled(Heading)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme('color_grey_3')};
  margin-bottom: 4px;
  font-size: 2.5rem;

  & > span {
    font-family: ${theme('font_headers')};
    font-size: 1.2rem;
    color: ${theme('color_grey_1')};
    cursor: pointer;
  }
`;

const LiveCount = styled.div`
  color: ${theme('color_grey_1')};
  font-size: 0.8em;

  & > span {
    color: ${theme('color_orange_1')};
  }
`;

const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  column-gap: 4px;
  margin-top: 20px;
  padding-bottom: 40px;
  width: 100%;
  align-items: center;
`;

const ControlWrapper = styled.div`
  height: 90%;
  background-color: ${theme('color_grey_3')};
  color: ${({ $disabled }) => ($disabled ? theme('color_grey_2') : 'inherit')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed !important' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;

  & > {
    span {
      font-size: 1.4em;
      transition: all 0.2s ease;
    }
  }

  &:active {
    & > span {
      color: ${theme('color_orange_1')};
    }
  }
  &:hover {
    background-color: ${({ $disabled }) => ($disabled ? theme('color_grey_3') : theme('color_blue_3'))};
  }
`;

const Question = styled.span`
  border: 1px solid ${theme('color_grey_2')};
  border-radius: 6px;
  color: ${theme('color_primary')};
  width: 100%;
  padding: 40px;
  min-height: 150px;
`;

/* utils */
let unsubscribe = null; // eslint-disable-line

const getLiveQuestion = (set) => {
  unsubscribe = store.collection('liveQuestion').onSnapshot((snap) => {
    const liveQuestion = docs(snap) || [];
    const questionId = liveQuestion[0].id;

    set(questionId);
  });
};

const updateLiveQuestion = (id) => {
  store.collection('liveQuestion').doc('live').set({ id });
};

/* component */
function Controls({ questions }) {
  const [liveQuestionId, setLiveQuestionId] = useState('');

  const liveQuestionIndex = questions.findIndex(({ id }) => id === liveQuestionId);
  const liveQuestion = questions[liveQuestionIndex] || { question: 'Please add a question' };

  const showQuestions = liveQuestionIndex !== -1;
  const leftDisabled = liveQuestionIndex <= 0;
  const rightDisabled = liveQuestionIndex >= questions.length - 1;

  const handleQuestion = (direction) => {
    const pickQuestion = (index) => {
      const newLiveId = questions[index].id;
      updateLiveQuestion(newLiveId);
    };

    if (direction === 'next') pickQuestion(liveQuestionIndex + 1);
    if (direction === 'prev') pickQuestion(liveQuestionIndex - 1);
  };

  useEffect(() => {
    getLiveQuestion(setLiveQuestionId);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!liveQuestionId && !!questions.length) updateLiveQuestion(questions[0].id);
  }, [liveQuestionId, questions]);

  return (
    <div>
      <StyledHeading secondary>Controls</StyledHeading>

      {showQuestions && (
        <LiveCount>
          Question Live: <span>#{liveQuestionIndex + 1}</span>
        </LiveCount>
      )}
      <ControlsContainer>
        <ControlWrapper $disabled={leftDisabled} onClick={() => !leftDisabled && handleQuestion('prev')}>
          <LeftOutlined />
        </ControlWrapper>
        <Question>{liveQuestion.question}</Question>
        <ControlWrapper $disabled={rightDisabled} onClick={() => !rightDisabled && handleQuestion('next')}>
          <RightOutlined />
        </ControlWrapper>
      </ControlsContainer>
    </div>
  );
}

Controls.propTypes = {
  questions: questionsPropTypes,
};

export default Controls;
