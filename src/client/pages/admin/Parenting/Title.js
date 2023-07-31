import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import theme from 'theme';

import Heading from '../../../components/Heading';
import { store, docs } from '../../../utils/firebase.utils';

const LessonHeadingContainer = styled.div`
  margin-top: 20px;

  & > ${Heading} {
    border-bottom: 1px solid ${theme('color_grey_3')};
  }
`;

const LessonTitle = styled.div`
  cursor: pointer;
  transition: background-color 0.3s ease;
  padding: 4px 10px;

  &:hover {
    background-color: ${theme('color_blue_3')};
  }
`;

const getTitle = (set) => {
  store
    .collection('liveQuestion')
    .doc('title')
    .get()
    .then((snap) => {
      const { title } = docs(snap) || { title: '' };
      set(title);
    });
};

const saveTitle = (title) => {
  store.collection('liveQuestion').doc('title').set({ title });
};

function Title() {
  const [title, setTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSave = ({ target: { value: newTitle } }) => {
    saveTitle(newTitle);
    setTitle(newTitle);
    setShowInput(false);
  };

  useEffect(() => {
    getTitle(setTitle);
  }, []);

  return (
    <LessonHeadingContainer>
      <Heading secondary>Lesson Title</Heading>
      {showInput ? (
        <Input
          autoFocus
          placeholder="Please add a lesson title"
          defaultValue={title}
          onPressEnter={handleSave}
          onBlur={handleSave}
        />
      ) : (
        <LessonTitle onClick={() => setShowInput(true)}>{title}</LessonTitle>
      )}
    </LessonHeadingContainer>
  );
}

export default Title;
