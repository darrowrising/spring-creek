import { createSelector } from 'reselect';
import moment from 'moment';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
// import messaging from '../../configs/messaging';
// import { fbRef } from '../../utils/fireDB';
import dateFormats from '../../configs/dateFormats';
// import { monthsArray } from '../../../../configs/dates';

const initialState = {};

export const singleEventEntities = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.GET_SINGLE_ANNOUNCEMENT_SUCCESS: {
            const data = result[0];

            data.month = data.month || moment(data.startDate || data.endDate, dateFormats.utc).format(dateFormats.month);

            const actionState = {
                event: data
            };

            return Object.assign({}, state, actionState);
        }
        default:
            return state;
    }
};


export const getEvent = createSelector(
    state => getEntities(state),
    entities => entities?.singleEvent?.event
);
