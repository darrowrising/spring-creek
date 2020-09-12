import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Loading from 'react-loading';
import { NavLink } from 'react-router-dom';
import { shape } from 'prop-types';

// components
import Leaders from '../../components/leaders/Leaders';
// utils
import { fbDocId, comingSunday } from '../../utils/date';
import db from '../../utils/fireDB';
import { sessionLinks, isSessionActive } from './Program.utils';
// configs
import dateFormats from '../../configs/dateFormats';
// styles
import './program.less';

const initialState = {
    date: comingSunday,
    presiding: 'Bishop Vaughn Kinghorn',
    conducting: '',
    chorister: '',
    organist: '',
    opening_hymn: '',
    invocation: '',
    sacrament_hymn: '',
    closing_hymn: '',
    benediction: '',
    program: [{
        type: 'talk',
        title: 'Speaker',
        value: 'TBA'
    }],
    loading: true
};

function Program({ history }) {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { program = [], loading } = state;
    const { pathname } = history.location;
    const { dateTime, fbDocId_long } = dateFormats;
    // handlers
    const date = state?.date ? moment(state?.date).format(dateTime) : moment(fbDocId, fbDocId_long).format(dateTime);
    const onstate = (snap) => {
        if (snap.exists()) return setState({ ...snap.val(), loading: false });
        return setState({ loading: false });
    };

    useEffect(() => {
        const param = pathname.split('program/')[1];
        const stateRef = db.ref(`program/${param || fbDocId}`);

        stateRef.on('value', onstate);

        return () => stateRef.off('value', onstate);
    }, [pathname]);

    return (
        <div className="program-container page center">
            { loading
                ? (
                    <div className="loading">
                        <Loading type="bars" color="#8FC1E3" />
                    </div>
                )
                : (
                    <div className="program-wrapper">
                        { sessionLinks().length > 1 && (
                            <div className="meeting-buttons-wrapper">
                                { sessionLinks().map(({ link, display }) => (
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
                            <div className="date">{date}</div>
                        </div>

                        <Leaders title="Presiding" value={state?.presiding || 'TBA'} />
                        <Leaders title="Conducting" value={state?.conducting || 'TBA'} />
                        <Leaders title="Chorister" value={state?.chorister || 'TBA'} />
                        <Leaders title="Organist" value={state?.organist || 'TBA'} />

                        <h3 className="center">Welcome</h3>

                        <Leaders
                            title="Opening Hymn"
                            value={state?.opening_hymn || 'TBA'}
                            subValue={state.opening_hymn_title}
                        />

                        <Leaders title="Invocation" value={state?.invocation || 'TBA'} />

                        <h3 className="center">Ward and Stake Business</h3>

                        <Leaders
                            title="Sacrament Hymn"
                            value={state?.sacrament_hymn || 'TBA'}
                            subValue={state.sacrament_hymn_title}
                        />

                        <h3 className="center bold sacrament">Administration of the Sacrament</h3>

                        {
                            program.sort((a, b) => a.priority - b.priority).map(item => (
                                <Leaders
                                    title={item.title}
                                    value={item.value}
                                />
                            ))
                        }

                        <Leaders
                            title="Closing Hymn"
                            value={state?.closing_hymn || 'TBA'}
                            subValue={state.closing_hymn_title}
                            className="closing-hymn"
                        />

                        <Leaders title="Benediction" value={state?.benediction || 'TBA'} />
                    </div>
                )}
        </div>
    );
}

Program.propTypes = {
    history: shape().isRequired
};

export default Program;
