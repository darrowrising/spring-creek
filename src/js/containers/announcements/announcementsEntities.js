import { createSelector } from 'reselect';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';

const initialState = {};

export const announcementEntities = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.SET_ANNOUCEMENT_SUCCESS: {
            const actionState = {
                toast: messaging.announcements.newSaved
            };

            return Object.assign({}, state, actionState);
        }
        case ActionTypes.GET_ANNOUCEMENT_LIST_SUCCESS: {
            const actionState = {
                data: result
            };

            return Object.assign({}, state, actionState);
        }
        default:
            return state;
    }
};

export const setAnnoucementEntities = createSelector(
    state => getEntities(state),
    entities => entities?.announcements
);

export const toastAnnoucement = createSelector(
    state => getEntities(state),
    entities => entities?.announcements?.toast
);

export const getAnnoucements = createSelector(
    state => getEntities(state),
    entities => entities?.announcements?.data
);
