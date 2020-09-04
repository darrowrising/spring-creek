import { createSelector } from 'reselect';
import moment from 'moment';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
// import dateFormats from '../../configs/dateFormats';
import { comingSunday } from '../../utils/date';

const initialState = {};

export const special_entity = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.GET_SPECIAL_ANNOUNCEMENT_SUCCESS: {
            const data = result.find(item => moment(item.endDate).isBefore(comingSunday) && !item.moderate);

            // data.general = true;

            const actionState = {
                assignment: data
            };

            return { ...state, ...actionState };
        }
        default:
            return state;
    }
};

export const getAssignments = createSelector(
    state => getEntities(state),
    entities => entities?.special?.assignment
);
