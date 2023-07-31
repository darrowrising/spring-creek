import React, { useState } from 'react';
import { func } from 'prop-types';
import styled from 'styled-components';
import { Input, Radio, Modal, Button, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { theme } from 'theme';
import { lighten } from 'polished';

import Heading from '../../../components/Heading';
import { store, docs } from '../../../utils/firebase.utils';
import { shortId } from '../../../utils/data.utils';
import { questionsPropTypes } from './propTypes';

const TYPE_OPTIONS = ['parent', 'teen', 'both'];

function EditQuestion({ onSave, onCancel, question: prevData }) {
  const [options, setOptions] = useState(
    () =>
      prevData.options || [
        {
          optionId: shortId(),
          label: '',
        },
      ]
  );

  const handleSave = (formData) => {
    const data = {
      ...prevData,
      ...formData,
      options,
    };
    onSave(data);
  };

  const handleOptionChange = (label, optionId) => {
    const newOptions = [...options];
    const index = options.findIndex(({ optionId: id }) => id === optionId);

    newOptions.splice(index, 1, { optionId, label });

    setOptions(newOptions);
  };

  return (
    <Form
      name="poll"
      onFinish={handleSave}
      initialValues={{
        ...prevData,
        options,
      }}
    >
      <Form.Item label="Who?" name="type">
        <Radio.Group>
          {TYPE_OPTIONS.map((typeOption) => (
            <Radio key={typeOption} value={typeOption}>
              {typeOption}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="question" name="question">
        <Input allowClear autoFocus placeholder="question" />
      </Form.Item>
      <Form.Item label="options" name="options">
        {options.map(({ optionId, label }) => (
          <Input
            allowClear
            placeholder="answer option"
            value={label}
            onChange={({ target: { value } }) => handleOptionChange(value, optionId)}
          />
        ))}
        <Button onClick={() => setOptions([...options, { optionId: shortId(), label: '' }])}>Add Option</Button>
      </Form.Item>
      <Form.Item style={{ justifyContent: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button htmlType="submit" type="primary">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}

EditQuestion.propTypes = {
  onSave: func,
  onCancel: func,
  question: questionsPropTypes,
};

const StyledHeading = styled(Heading)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme('color_grey_3')};
  margin-bottom: 4px;
  font-size: 2.5rem;
`;

const QuestionsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ClearWrapper = styled.div`
  display: flex;
  gap: 10px;

  & > span {
    font-family: ${theme('font_headers')};
    font-size: 1.2rem;
    color: ${theme('color_grey_1')};
    cursor: pointer;
  }
`;

const Count = styled.span`
  color: ${theme('color_grey_2')};
  padding-left: 6px;
  font-size: 0.8em;
`;

const List = styled.div`
  display: grid;
  row-gap: 4px;
`;

const QuestionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 0;
  gap: 5px;

  &:nth-child(even) {
    background-color: ${lighten(0.22, theme('color_blue_3'))};
  }

  .anticon-delete {
    cursor: pointer;
    font-size: 0.8em;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme('color_danger')};
    }
  }
`;

const Question = styled.div`
  padding: 0 4px;
`;

const AddQuestionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 4px 6px 12px;
  font-size: 0.8em;
  color: ${theme('color_grey_1')};
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${theme('color_grey_3')};

  &:hover {
    color: ${theme('color_primary')};
  }
`;

const AddIconWrapper = styled.div`
  font-family: ${theme('font_brand')};
  padding: 2px 6px;
`;

/* utils */
const saveQuestion = ({ question, id, priority, type, options }) => {
  const questionId = id || shortId();

  if (!question && id) {
    return store.collection('parenting').doc(id).delete();
  }

  if (question)
    store.collection('parenting').doc(questionId).set({ id: questionId, question, priority, type, options });
};

const deleteQuestion = (id) => {
  store.collection('parenting').doc(id).delete();
};

const clearAll = (questions) => {
  questions.forEach(({ id }) => deleteQuestion(id));
  store.collection('liveQuestion').doc('live').set({ id: '' });
};

const clearAnswers = (questions) => {
  questions.forEach(({ id }) => {
    store
      .collection('parenting')
      .doc(id)
      .collection('answers')
      .get()
      .then((snap) => {
        const answers = docs(snap) || [];
        answers.forEach(({ docId }) => {
          if (docId) {
            store.collection('parenting').doc(id).collection('answers').doc(docId).delete();
          }
        });
      });
  });
};

/* component */
function Questions({ questions }) {
  const [questionEditId, setQuestionEditId] = useState('');

  const isModalOpen = !!questionEditId;
  const editQuestion = questions.find(({ id }) => id === questionEditId) || {};

  const onSave = (formData) => {
    const { priority } = formData;
    saveQuestion({ ...formData, priority: priority || questions.length + 1 });
    setQuestionEditId('');
  };

  const onCancel = () => {
    setQuestionEditId('');
  };

  return (
    <div>
      <StyledHeading secondary>
        <QuestionsWrapper>
          Questions<Count>({questions.length})</Count>
        </QuestionsWrapper>
        <ClearWrapper>
          <span onClick={() => clearAll(questions)}>clear all</span>
          <span onClick={() => clearAnswers(questions)}>clear answers</span>
        </ClearWrapper>
      </StyledHeading>
      <List>
        {questions.map(({ question, id }) => (
          <QuestionWrapper key={id}>
            <Question onClick={() => setQuestionEditId(id)}>{question}</Question>
            <DeleteOutlined onClick={() => deleteQuestion(id)} />
          </QuestionWrapper>
        ))}
        <AddQuestionContainer onClick={() => setQuestionEditId(shortId())}>
          Add Question
          <AddIconWrapper>
            <PlusOutlined />
          </AddIconWrapper>
        </AddQuestionContainer>
      </List>
      <Modal visible={isModalOpen} destroyOnClose header={null} footer={null} onCancel={onCancel}>
        <EditQuestion onSave={onSave} onCancel={onCancel} question={editQuestion} />
      </Modal>
    </div>
  );
}

Questions.propTypes = {
  questions: questionsPropTypes,
};

export default Questions;
