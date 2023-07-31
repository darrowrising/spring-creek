import React, { useState, useEffect, Fragment } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { func } from 'prop-types';
import { darken } from 'polished';
import theme from 'theme';

import Layout from '../../../layouts/Simple';
import Loading from '../../../components/Loading/Loading';
import Heading from '../../../components/Heading';
import { store, docs } from '../../../../js/utils/fireDB';
import { getStorage, setStorage } from '../../../utils/localStorage.utils';
import { shortId } from '../../../utils/data.utils';
import { colors } from '../../../themes/standard/colors';

const parentColor = theme('color_org_relief_society');
const youthColor = theme('color_org_youth');
const parentTextColor = darken(0.3, colors.color_org_relief_society);
const youthTextColor = darken(0.3, colors.color_org_youth);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AddTypeContainer = styled.div`
  animation: ${fadeIn} 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  border-radius: 6px;
  width: 90%;
  padding: 20px 20px 60px 20px;
  background-color: ${theme('color_white_1')};
  max-width: 350px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`;

const TypeButton = styled.div`
  background-color: ${({ type }) => (type === 'parent' ? parentColor : youthColor)};
  padding: 40px;
  color: ${({ type }) => (type === 'parent' ? parentTextColor : youthTextColor)};
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-family: ${theme('font_brand')};
  font-size: 1.6em;

  &:hover {
    opacity: 0.8;
  }
`;

const TYPE_PARENT = 'parent';
const TYPE_YOUTH = 'teen';

function AddType({ saveType }) {
  return (
    <AddTypeContainer>
      <Box>
        <Heading>Which are you?</Heading>
        <ButtonWrapper>
          <TypeButton type="parent" onClick={() => saveType(TYPE_PARENT)}>
            {TYPE_PARENT}
          </TypeButton>
          <TypeButton onClick={() => saveType(TYPE_YOUTH)}>{TYPE_YOUTH}</TypeButton>
        </ButtonWrapper>
      </Box>
    </AddTypeContainer>
  );
}

AddType.propTypes = {
  saveType: func,
};

/* main styles */
const Display = styled.div`
  animation: ${fadeIn} 0.5s ease;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100%;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
`;

const TypeBar = styled.div`
  background-color: ${({ type }) => (type === 'parent' ? parentColor : youthColor)};
  text-align: left;
  padding: 4px 20px;
  color: ${({ type }) => (type === 'parent' ? parentTextColor : youthTextColor)};
  font-family: ${theme('font_brand')};
  font-size: 1.2em;
  cursor: pointer;
`;

const Question = styled.strong`
  animation: ${fadeIn} 1.5s ease;
  align-self: center;
  font-family: ${theme('font_headers')};
  color: ${theme('color_primary')};
  font-size: 3vh;
  padding: 6vh 6vw 1vh 6vw;
`;

const InteractWrapper = styled.div`
  justify-self: center;
  display: flex;
  justify-content: ${({ $direction }) => ($direction === 'column' ? 'start' : 'center')};
  align-items: ${({ $direction }) => ($direction === 'column' ? 'center' : 'start')};
  flex-direction: ${({ $direction }) => $direction};
  gap: 1.5vh;
  padding: 2vw;
  height: 100%;
`;

const answerAnimation = keyframes`
  0% {
    background-color: ${theme('color_grey_3')};
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    background-color: ${theme('color_green_1')};
    transform: scale(1);
  }
`;

const Option = styled.div`
  background-color: ${theme('color_grey_3')};
  border-radius: 6px;
  padding: 3vh;
  font-size: 2.2vh;
  cursor: ${({ $hasAnswered }) => ($hasAnswered ? 'not-allowed' : 'pointer')};
  width: 80vw;

  &.answer {
    animation: ${answerAnimation} 0.5s ease-out;
    background-color: ${theme('color_green_1')};
  }

  ${({ $hasAnswered }) =>
    $hasAnswered
      ? ''
      : css`
          &:active {
            background-color: ${theme('color_grey_2')};
          }
        `}
`;

const NotEligible = styled.div`
  color: ${theme('color_orange_2')};
`;

/* utils */
let unsubscribeId = null; // eslint-disable-line
let unsubscribeQuestions = null; // eslint-disable-line

const getLiveQuestionId = (set) => {
  unsubscribeId = store.collection('liveQuestion').onSnapshot((snap) => {
    const questions = docs(snap) || [];
    set(questions[0].id);
  });
};

const getQuestions = (set, setLoading) => {
  unsubscribeQuestions = store
    .collection('parenting')
    .orderBy('priority', 'asc')
    .onSnapshot((snap) => {
      const questions = docs(snap) || [];
      set(questions);
      setLoading(false);
    });
};

const saveAnswer = ({ id, answer, type }) => {
  const docId = shortId();
  store.collection('parenting').doc(id).collection('answers').doc(docId).set({ collectionId: id, docId, type, answer });
};

const initialState = [
  {
    id: '',
    question: '',
    priority: '',
  },
];
const STORAGE_ANSWERS = 'answers';
const STORAGE_TYPE = 'type';
const LOADING_TYPE = 'loadingType';
const NO_TYPE = 'noType';

/* component */
function InTake() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(initialState);
  const [liveQuestionId, setLiveQuestionId] = useState('');
  const [previousAnswers, setPreviousAnswers] = useState([]);
  const [type, setType] = useState(LOADING_TYPE);

  const liveQuestion = questions.find(({ id }) => id === liveQuestionId) || initialState[0];
  const response = previousAnswers.find(({ id }) => id === liveQuestionId);
  const hasAnswered = !!response?.id;
  const eligible = liveQuestion.type === 'both' || type === liveQuestion.type;

  const handleType = (name) => {
    setStorage(STORAGE_TYPE, name);
    setType(name);
  };

  const handleAnswer = (answer) => {
    const updatedAnswers = [...previousAnswers, { id: liveQuestionId, answer }];

    setStorage(STORAGE_ANSWERS, updatedAnswers);
    setPreviousAnswers(updatedAnswers);
    saveAnswer({ id: liveQuestionId, answer, type });
  };

  useEffect(() => {
    getLiveQuestionId(setLiveQuestionId);
    getQuestions(setQuestions, setLoading);
    setType(getStorage(STORAGE_TYPE) || NO_TYPE);
    setPreviousAnswers(getStorage(STORAGE_ANSWERS) || []);

    return () => {
      unsubscribeId();
      unsubscribeQuestions();
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <Display>
        <Question key={liveQuestionId}>
          {liveQuestion.question} {!eligible && <NotEligible>{liveQuestion.type} voting only</NotEligible>}
        </Question>
        <InteractWrapper $direction={liveQuestion.options.length > 1 ? 'column' : 'row'}>
          {liveQuestion.options.map(({ optionId, label }) => (
            <Fragment key={optionId}>
              <Option
                className={response?.answer === optionId ? 'answer' : ''}
                $hasAnswered={!eligible || hasAnswered}
                onClick={() => eligible && !hasAnswered && handleAnswer(optionId)}
              >
                {label}
              </Option>
            </Fragment>
          ))}
        </InteractWrapper>
        {!!type && type !== NO_TYPE && (
          <TypeBar type={type} onClick={() => handleType(NO_TYPE)}>
            {type}
          </TypeBar>
        )}
      </Display>
      {type === NO_TYPE && <AddType saveType={handleType} />}
    </Layout>
  );
}

export default InTake;
