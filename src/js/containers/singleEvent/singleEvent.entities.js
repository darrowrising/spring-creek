import { createSelector } from 'reselect';
import moment from 'moment';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';
// import { fbRef } from '../../utils/fireDB';
import dateFormats from '../../configs/dateFormats';
// import { monthsArray } from '../../../../configs/dates';

const initialState = {};

export const singleEventEntities = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.GET_SINGLE_ANNOUNCEMENT_SUCCESS: {
            const data = result[0];
            const handleDate = (date) => {
                if (date && moment(date).isValid()) {
                    return moment(date, dateFormats.utc).format(dateFormats.month);
                }

                return false;
            };

            if (data) {
                data.month = data.month || handleDate(data.date) || handleDate(data.startDate || data.endDate);
            }

            const actionState = {
                event: data || false
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.DELETE_ANNOUNCEMENT_SUCCESS: {
            const actionState = {
                toast: messaging.toaster.removeRequest
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.EDIT_ANNOUNCEMENT_SUCCESS: {
            const actionState = {
                toast: messaging.toaster.editRequest
            };

            return { ...state, ...actionState };
        }
        default:
            return state;
    }
};


export const getEvent = createSelector(
    (state) => getEntities(state),
    (entities) => entities?.singleEvent?.event
);

export const toastEvent = createSelector(
    (state) => getEntities(state),
    (entities) => entities?.singleEvent?.toast
);
