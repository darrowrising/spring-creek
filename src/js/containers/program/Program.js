import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Loading from 'react-loading';
import { NavLink } from 'react-router-dom';
import { shape } from 'prop-types';

// components
import Leaders from '../../components/leaders/Leaders';
import * as CSB from '../../../client/static/csb';
import PDF from '../../../client/components/PDF/PDF';
// utils
import { fbDocId } from '../../utils/date';
import { sessionLinks, isSessionActive, getProgramData, unsubscribe } from './Program.utils';
import { handleState } from '../../../client/utils/state.utils';
// configs
import dateFormats from '../../configs/dateFormats';
import { meetingTimes } from '../../../configs/unit.config';
// styles
import './program.less';

const initialState = {
    date: moment(`${fbDocId}_${meetingTimes[0]}`, dateFormats.fbDocId_long).format(dateFormats.dateTime),
    presiding: 'Bishop Vaughn Kinghorn',
    program: [
        {
            type: 'talk',
            title: 'Speaker',
            value: 'TBA',
        },
    ],
    time: '00:00',
    loading: true,
    errorMessage: '',
};

function Program({ history }) {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { program = [], loading } = state;
    const { pathname } = history.location;
    // handlers
    const set = (update) => handleState(update, setState);
    const csbHymns = Object.keys(state)
        .filter((item) => item.includes('fileName'))
        .filter((item) => state[item])
        .map((item) => state[item]);

    useEffect(() => {
        const programDate = pathname.split('program/')[1];

        getProgramData(set, programDate);

        return () => unsubscribe();
    }, [pathname]);

    return (
        <div className="program-container page center">
            {loading ? (
                <div className="loading">
                    <Loading type="bars" color="#8FC1E3" />
                </div>
            ) : (
                <div className="program-wrapper">
                    {sessionLinks().length > 1 && (
                        <div className="meeting-buttons-wrapper">
                            {sessionLinks().map(({ link, display }) => (
                                <NavLink
                                    exact
                                    to={link}
                                    className="meeting-button"
                                    isActive={() => isSessionActive(state.date, display)}
                                >
                                    {display}
                                </NavLink>
                            ))}
                        </div>
                    )}
                    <div className="center">
                        <h1 className="page-header">Sacrament Meeting</h1>
                        <div className="date">{state.date}</div>
                    </div>

                    <Leaders title="Presiding" value={state?.presiding} />
                    <Leaders title="Conducting" value={state?.conducting} />
                    <Leaders title="Chorister" value={state?.chorister} />
                    <Leaders title="Organist" value={state?.organist} />

                    <h3 className="center">Welcome</h3>

                    <Leaders
                        title="Opening Hymn"
                        value={state?.opening_hymn && `#${state?.opening_hymn}`}
                        subValue={state.opening_hymn_title}
                    />

                    <Leaders title="Invocation" value={state?.invocation} />

                    <h3 className="center">Ward and Stake Business</h3>

                    <Leaders
                        title="Sacrament Hymn"
                        value={state?.sacrament_hymn && `#${state?.sacrament_hymn}`}
                        subValue={state.sacrament_hymn_title}
                        style={{ marginTop: '40px' }}
                    />

                    <h3 className="center bold sacrament">Administration of the Sacrament</h3>
                    {/* eslint-disable react/jsx-indent, indent */}
                    {csbHymns.length !== 0
                        ? csbHymns.map((csbHymn) => (
                              <div className="csb-wrapper">
                                  <PDF file={CSB[csbHymn]} />
                              </div>
                          ))
                        : null}
                    {/* eslint-enable react/jsx-indent, indent */}

                    {program
                        .sort((a, b) => a.priority - b.priority)
                        .map((item) => {
                            switch (item.type) {
                                case 'music': {
                                    return (
                                        <div className="center musical-number-wrapper">
                                            <div className="musical-title">{item.title}</div>
                                            <div className="musical-number">{item.value}</div>
                                        </div>
                                    );
                                }
                                case 'meeting': {
                                    return <div className="testimony-meeting center bold">{item.value}</div>;
                                }
                                default: {
                                    return <Leaders title={item.title} value={item.value} />;
                                }
                            }
                        })}

                    <Leaders
                        title="Closing Hymn"
                        value={state?.closing_hymn && `#${state?.closing_hymn}`}
                        subValue={state.closing_hymn_title}
                        className="closing-hymn"
                    />

                    <Leaders title="Benediction" value={state?.benediction || 'TBA'} style={{ marginBottom: '40px' }} />
                </div>
            )}
        </div>
    );
}

Program.propTypes = {
    history: shape().isRequired,
};

export default Program;
