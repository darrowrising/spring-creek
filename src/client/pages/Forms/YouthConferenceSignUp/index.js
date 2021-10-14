/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Alert, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
// components
import Layout from '../../../layouts/Old/Old';
import Heading from '../../../components/Heading';
// utils
import { handleState } from '../../../utils/state.utils';
import { handleSubmit, insertValueToArray, removeValueToArray, handleDisable } from './utils';
// styles
import {
    Description,
    EventContainer,
    Label,
    StyledInput,
    Column,
    LastWrapper,
    RemoveRowButton,
    StyledTextArea,
    Date,
} from './styles';

const initialState = {
    devotional: [''],
    activity: [''],
    overnight: [''],
    instructions: '',
    errorMessage: '',
};

function YouthConferenceSignUp() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { errorMessage, devotional, activity, overnight, instructions } = state;
    // handlers
    const set = (update) => handleState(update, setState);
    const addChild = () =>
        set({
            devotional: [...devotional, ''],
            activity: [...activity, ''],
            overnight: [...overnight, ''],
        });

    return (
        <Layout style={{ maxWidth: '700px' }}>
            {errorMessage && <Alert type="error" message={errorMessage} />}
            <Heading>Youth Conference 2021 Signup</Heading>
            <Description>
                We would love to have you take a few minutes and let us know which days your children will be attending
            </Description>
            <EventContainer>
                <Column>
                    <div>
                        <Label>Sunday Devotional</Label>
                        <Date>October 31st @ 7 PM</Date>
                    </div>
                    {devotional.map((name, index) => (
                        <StyledInput
                            key={`devotional-${index}`}
                            onChange={({ target: { value } }) =>
                                set({ devotional: insertValueToArray(devotional, index, value) })
                            }
                            value={name}
                        />
                    ))}
                </Column>
                <Column>
                    <div>
                        <Label>Wednesday Night Activity</Label>
                        <Date>Nov 3 @ 7 PM</Date>
                    </div>
                    {activity.map((name, index) => (
                        <StyledInput
                            key={`activity-${index}`}
                            onChange={({ target: { value } }) =>
                                set({ activity: insertValueToArray(activity, index, value) })
                            }
                            value={name}
                        />
                    ))}
                </Column>
                <Column>
                    <div>
                        <Label>Friday Overnight</Label>
                        <Date>Nov 5th & 6th</Date>
                    </div>
                    {overnight.map((name, index) => (
                        <LastWrapper key={`overnight-${index}`}>
                            <StyledInput
                                onChange={({ target: { value } }) =>
                                    set({ overnight: insertValueToArray(overnight, index, value) })
                                }
                                className="overnight-input"
                                value={name}
                            />
                            {index !== 0 && (
                                <RemoveRowButton
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => removeValueToArray(state, index, set)}
                                />
                            )}
                        </LastWrapper>
                    ))}
                </Column>
            </EventContainer>
            <Button onClick={addChild} style={{ float: 'left', margin: '10px 0 20px' }}>
                add another child
            </Button>
            <Label style={{ clear: 'both' }}>Extra instructions</Label>
            <StyledTextArea
                autoSize
                placeholder="additional instructions..."
                onChange={({ target: { value } }) => set({ instructions: value })}
                value={instructions}
            />
            <Button
                disabled={handleDisable(state)}
                size="large"
                type="primary"
                onClick={() => handleSubmit(state, set)}
                style={{ marginTop: '20px' }}
            >
                Submit
            </Button>
        </Layout>
    );
}

export default YouthConferenceSignUp;
