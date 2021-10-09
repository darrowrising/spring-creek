import React, { useState } from 'react';
import { Alert, Input, Button, Modal } from 'antd';
// components
import Layout from '../../../layouts/Old/Old';
import Heading from '../../../components/Heading';
// utils
import { handleState } from '../../../utils/state.utils';
import { handleSubmit } from './utils';
// styles
import { Description, EventContainer, Label } from './styles';

const initialState = {
    devotional: '',
    activity: '',
    overnight: '',
    errorMessage: '',
    showModal: false,
};

function YouthConferenceSignUp() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { errorMessage, devotional, activity, overnight, showModal } = state;
    // handlers
    const set = (update) => handleState(update, setState);

    return (
        <Layout style={{ maxWidth: '600px' }}>
            {errorMessage && <Alert type="error" message={errorMessage} />}
            <Heading>Youth Conference 2021 Signup</Heading>
            <div>Nov 3 to Nov 5</div>
            <Description>
                We would love to have you take a few minutes and let us know which days your children will be attending
            </Description>
            <EventContainer>
                <div>
                    <div>
                        <Label>Sunday Devotional</Label>
                        <span>Nov 3 @ 7 PM</span>
                    </div>
                    <Input placeholder="Name of person attending" onChange={(name) => set({ devotional: name })} />
                </div>
                <div>
                    <div>
                        <Label>Wednesday Night Activity</Label>
                        <span>Nov 5 @ 7 PM</span>
                    </div>
                    <Input placeholder="Name of person attending" onChange={(name) => set({ activity: name })} />
                </div>
                <div>
                    <div>
                        <Label>Friday Overnight</Label>
                        <span>Nov 6 @ 7 PM</span>
                    </div>
                    <Input placeholder="Name of person attending" onChange={(name) => set({ overnight: name })} />
                </div>
            </EventContainer>
            <Button
                disabled={devotional || !activity || !overnight}
                size="large"
                type="primary"
                onClick={() => handleSubmit(state, set)}
            >
                Submit
            </Button>
            <Modal header={null} footer={null} visible={showModal} closable={false} maskClosable={false} width={400}>
                <div>Thank you for your question</div>
            </Modal>
        </Layout>
    );
}

export default YouthConferenceSignUp;
