import React, { useState, useEffect } from 'react';
import { shape } from 'prop-types';
import { Input, Alert, Modal } from 'antd';

// layouts
import Layout from '../../layouts/Old/Old';
// utils
import { handleState } from '../../utils/state.utils';
import { saveQuestion } from './Questions.utils';
// styles
import { Title, Description, Label, ButtonStyled, Message, Sub } from './Questions.styles';

const { TextArea } = Input;

const initialState = {
    question: '',
    success: false,
    errorMessage: '',
};

function Questions({ match }) {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { category } = match.params;
    const { question, errorMessage, success } = state;
    // handlers
    const set = (update) => handleState(update, setState);
    const handleSubmit = () => {
        const data = {
            question,
            category,
        };
        saveQuestion(data, set);
    };

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                set(initialState);
            }, 3000);
        }
    }, [success]);

    return (
        <Layout style={{ maxWidth: '600px' }}>
            {errorMessage && <Alert type="error" message={errorMessage} />}
            <Title>We want to hear from you</Title>
            <Description>
                For our 5th Sunday this month we would like to answer questions you might have. Please submit below.
            </Description>
            <Sub>All questions submitted are anonymous.</Sub>
            <Label>Your Question</Label>
            <TextArea onChange={(event) => set({ question: event.target.value })} value={question} />
            <ButtonStyled disabled={!question} size="large" type="primary" onClick={handleSubmit}>
                Send
            </ButtonStyled>
            <Modal header={null} footer={null} visible={success} closable={false} maskClosable={false} width={400}>
                <Message>Thank you for your question</Message>
            </Modal>
        </Layout>
    );
}

Questions.propTypes = {
    match: shape().isRequired,
};

export default Questions;
