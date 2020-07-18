import { createSelector } from 'reselect';
import moment from 'moment';

import dateFormats from '../../configs/dateFormats';
import { comingSunday } from '../../utils/date';
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
            const defaultVal = 'TBA';
            const init = {
                date: program.date || comingSunday,
                presiding: defaultVal,
                conducting: defaultVal,
                chorister: defaultVal,
                organist: defaultVal,
                opening_hymn: defaultVal,
                invocation: defaultVal,
                sacrament_hymn: defaultVal,
                closing_hymn: defaultVal,
                benediction: defaultVal,
                speakers: program?.speakers?.filter((item) => item) || []
            };

            program.date = moment(init.date).format(dateFormats.longDate);

            return { ...state, ...init, ...program };
        }
        default:
            return state;
    }
};

export const setProgramViewState = createSelector(
    (state) => getViewStates(state),
    (viewState) => viewState?.program || {}
);
