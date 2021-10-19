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
                <h4>Sunday, October 31st</h4>
                <p>
                    Kickoff Fireside @ 4 p.m. in the Chapel (Sunday dress) Youth and leaders are invited. Refreshments
                    will be served
                </p>
                <h4>Wednesday, Nov 3rd</h4>
                <p>Glow in the dark volleyball and dodgeball at 7 p.m. Gym</p>
                <h4>Friday, Nov 5th</h4>
                <p>
                    Overnight at{' '}
                    <a href="https://camping.churchofjesuschrist.org/property/561215" target="_blank" rel="noreferrer">
                        Snydermill Recreation Camp
                    </a>{' '}
                    (in Kimball Junction, near Park City)
                </p>
                <ul>
                    <li>Indoor sleeping areas (separate for young women and young men)</li>
                    <li>Food, outdoor and indoor games, service project and lots of fun</li>
                    <li>Meet at the church at 4 p.m. on Friday</li>
                    <li>Home by 4 p.m. on Saturday</li>
                </ul>
            </Description>
            <Heading as="h3" style={{ textAlign: 'left', fontSize: '1.3rem' }}>
                Please sign up for the days your child can attend
            </Heading>
            <EventContainer>
                <Column>
                    <div>
                        <Label>Sunday Devotional</Label>
                        <Date>October 31st @ 4 p.m.</Date>
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
                        <Date>Nov 3 @ 7 p.m.</Date>
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
                        <Date>
                            Nov 5th & 6th @{' '}
                            <a
                                href="https://camping.churchofjesuschrist.org/property/561215"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Snyder Mill
                            </a>
                        </Date>
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
            <Label style={{ clear: 'both' }}>Additional instructions needed for your child? (optional)</Label>
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
