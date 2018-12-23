import { createSelector } from 'reselect';
import moment from 'moment';

import dateFormats from '../../configs/dateFormats';
import { getViewStates } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';

const initialState = {
    speakers: []
};

export const programViewStates = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.GET_PROGRAM_REQUEST: {
            return {};
        }
        case ActionTypes.GET_PROGRAM_SUCCESS: {
            const program = { ...result };

            program.date = moment(program.date).format(dateFormats.longDate);
            program.speakers = program.speakers.filter(item => item);

            return Object.assign({}, state, program);
        }
        default:
            return state;
    }
};

export const setProgramViewState = createSelector(
    state => getViewStates(state),
    viewState => viewState?.program || {}
);
