import { createSelector } from 'reselect';
import moment from 'moment';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';
import { fbRef } from '../../utils/fireDB';

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
            const data = result.filter((item) => {
                const now = moment();
                const eventDate = moment(item.date);
                const diff = eventDate.diff(now, 'days') < -1;

                if (diff) {
                    const options = {
                        type: 'remove',
                        docId: `/announcements/${item.id}`,
                    };

                    fbRef(options);
                }

                return !diff;
            });
            const actionState = {
                data
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
