import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Layout from '../../../layouts/Main/Main';
import PageHeading from '../../../components/PageHeader/PageHeader';
import Questions from './Questions';
import Controls from './Controls';
import Title from './Title';
import { store, docs } from '../../../utils/firebase.utils';

const Container = styled.div`
  display: grid;
  justify-content: center;

  & > div {
    width: 600px;
  }
`;

let unsubscribe = null; // eslint-disable-line

const getQuestions = (set) => {
  unsubscribe = store
    .collection('parenting')
    .orderBy('priority', 'asc')
    .onSnapshot((snap) => {
      const questions = docs(snap) || [];
      set(questions);
    });
};

function Parenting() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestions(setQuestions);
    return () => unsubscribe();
  }, []);

  return (
    <Layout>
      <Container>
        <PageHeading>Parenting Questions</PageHeading>
        <Controls questions={questions} />
        <Questions questions={questions} />
        <Title />
      </Container>
    </Layout>
  );
}

export default Parenting;
