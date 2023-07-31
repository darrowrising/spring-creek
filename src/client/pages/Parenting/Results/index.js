import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { arrayOf, shape, string, bool } from 'prop-types';
import { darken } from 'polished';
import theme from 'theme';

import Layout from '../../../layouts/Simple';
import Loading from '../../../components/Loading/Loading';
import { store, docs } from '../../../../js/utils/fireDB';
import { core } from '../../../themes/standard/colors';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/* NotVoting component */
const OnlyVotingMessaging = styled.div`
  position: absolute;
  right: 20%;
  bottom: 0;
  font-size: 1vw;
  color: ${theme('color_orange_2')};
  text-transform: capitalize;
`;

function TypeOnlyVoting({ type }) {
  if (type === 'both') return null;
  return <OnlyVotingMessaging>{type} Only Voting</OnlyVotingMessaging>;
}

TypeOnlyVoting.propTypes = {
  type: string,
};

/* ResultRow component */
const ResultRowContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4vh;
`;
const Option = styled.div`
  font-size: 2.5vh;
  font-family: ${theme('font_headers')};
  transition: all 0.3s ease;
`;
const Percentage = styled.div`
  font-size: 3.5vw;
  font-family: ${theme('font_brand')};
  color: ${theme('color_grey_1')};
  transition: all 0.3s ease;
`;
const Result = styled.div`
  border: 1px solid ${theme('color_grey_2')};
  border-radius: 1vw;
  padding: 3vh 6vw;
  transform: ${({ $isWinner }) => ($isWinner ? 'scale(1.1)' : 'scale(1)')};
  transition: all 0.3s ease;

  ${({ $isWinner }) => css`
    & > ${Option} {
      color: ${darken(0.4, $isWinner ? core.color_green_1 : core.color_grey_3)};
    }
    & > ${Percentage} {
      color: ${$isWinner ? theme('color_green_1') : theme('color_grey_2')};
    }
  `}
`;

function ResultRow({ results }) {
  return (
    <ResultRowContainer>
      {results.map(({ id, option, percentage, winner }) => (
        <Result key={id} $isWinner={winner}>
          <Option>{option}</Option>
          <Percentage>{percentage}%</Percentage>
        </Result>
      ))}
    </ResultRowContainer>
  );
}

ResultRow.propTypes = {
  results: arrayOf(
    shape({
      percentage: string,
      option: string,
      id: string,
      winner: bool,
    })
  ),
};

// const filterByTypes = (results) =>
//   results.reduce(
//     (acc, cur) => {
//       const [parent, teen] = [...acc];
//       const { type } = cur;

//       if (type === 'parent') parent.push(cur);
//       else teen.push(cur);
//       return [parent, teen];
//     },
//     [[], []]
//   );
const calcTotals = (results, options) => {
  const initTotals = options.map(({ label, optionId }) => ({ id: optionId, option: label, total: 0 }));

  return results.reduce((acc, cur) => {
    const newData = [...acc];
    const optionIndex = newData.findIndex(({ id }) => id === cur.answer);

    const prevData = newData[optionIndex];
    const datum = {
      ...prevData,
      total: prevData?.total + 1,
    };

    newData.splice(optionIndex, 1, datum);
    return newData;
  }, initTotals);
};

const calcPercentage = (results, all) =>
  results.map((result) => ({
    ...result,
    percentage: result.total ? Math.floor((result.total / all) * 100) : result.total,
  }));

const calcWinner = (results) => {
  const percentages = results.map(({ percentage }) => percentage);
  const highestNumber = Math.max(...percentages);

  return results.map((data) => ({
    ...data,
    winner: !!data.percentage && data.percentage === highestNumber,
  }));
};

// const mockData = [
//   {
//     percentage: 80,
//     option: 'Yes',
//     id: '1',
//     winner: true,
//   },
//   {
//     percentage: 20,
//     option: 'No',
//     id: '2',
//     winner: false,
//   },
// ];

function ShowResults({ options = [], results }) {
  const totals = calcTotals(results, options);
  const percentage = calcPercentage(totals, results.length);
  const data = calcWinner(percentage);

  return (
    <div>
      <ResultRow results={data} />
    </div>
  );
}

ShowResults.propTypes = {
  options: arrayOf(
    shape({
      label: string,
      optionId: string,
    })
  ),
  results: arrayOf(
    shape({
      answer: string,
      type: string,
    })
  ),
};

/* main styles */
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
`;

const Display = styled.div`
  animation: ${fadeIn} 0.5s ease;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 20px;
  height: 100%;
`;

const Title = styled.div`
  color: ${theme('color_grey_2')};
  text-align: left;
  font-family: ${theme('font_brand')};
  font-size: 2vw;
  align-self: center;
  padding: 2vh 6vw;
`;

const Question = styled.strong`
  animation: ${fadeIn} 1.5s ease;
  align-self: center;
  font-family: ${theme('font_headers')};
  color: ${theme('color_primary')};
  font-size: 6vh;
  padding: 0vh 6vw 2vh 6vw;
  position: relative;
`;

/* utils */
let unsubscribeId = null; // eslint-disable-line
let unsubscribeAnswers = null;

const getLiveQuestionId = (set, setLoading) => {
  unsubscribeId = store.collection('liveQuestion').onSnapshot((snap) => {
    const data = docs(snap) || [{}, {}];
    const liveQuestionId = data[0].id || '';
    const title = data[1].title || '';

    set({ liveQuestionId, title });
    setLoading(false);
  });
};

const getQuestion = (docId, set) => {
  store
    .collection('parenting')
    .doc(docId)
    .get()
    .then((snap) => {
      const question = docs(snap) || {};
      set(question);
    });
};

const getAnswers = (docId, set) => {
  unsubscribeAnswers = store
    .collection('parenting')
    .doc(docId)
    .collection('answers')
    .onSnapshot((snap) => {
      const answers = docs(snap) || [];
      set(answers);
    });
};

function Results() {
  const [loading, setLoading] = useState(true);
  const [{ liveQuestionId, title }, setLiveQuestion] = useState('');
  const [{ question, type, id, options }, setQuestion] = useState({});
  const [results, setResults] = useState([]);

  useEffect(() => {
    getLiveQuestionId(setLiveQuestion, setLoading);
    return () => unsubscribeId();
  }, []);

  useEffect(() => {
    if (liveQuestionId) {
      getQuestion(liveQuestionId, setQuestion);
      getAnswers(liveQuestionId, setResults);

      return () => {
        unsubscribeAnswers();
      };
    }
  }, [liveQuestionId]);

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
        <Title>{title}</Title>
        <Question key={id}>
          {question}
          <TypeOnlyVoting type={type} />
        </Question>
        <ShowResults type={type} options={options} results={results} />
      </Display>
    </Layout>
  );
}

export default Results;
