import { createSelector } from 'reselect';
import moment from 'moment';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';
import { fbRef } from '../../utils/fireDB';
import dateFormats from '../../configs/dateFormats';
import { monthsArray } from '../../../../configs/dates';

const initialState = {};

export const announcementEntities = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.SET_ANNOUCEMENT_SUCCESS: {
            const actionState = {
                toast: messaging.announcements.newSaved,
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.GET_ANNOUCEMENT_LIST_SUCCESS: {
            let data = {};
            // const currentMonth = moment().format(dateFormats.month);

            result
                .filter((item) => {
                    const now = moment();
                    const eventDate = moment(item.endDate || item.date);
                    const oldEvent = moment(now).isAfter(moment(eventDate).add('day', 1));

                    if (oldEvent) {
                        const options = {
                            type: 'remove',
                            docId: `/announcements/${item.id}`,
                        };

                        fbRef(options);
                    }

                    return !oldEvent;
                })
                .map((item) => {
                    const content = item;
                    const date = item.startDate || item.endDate || item.date;

                    if (!item.month) content.month = moment(date).format(dateFormats.month);

                    return content;
                })
                .forEach((item) => {
                    const month = data[item.month];

                    if (item.general && !data.general) {
                        // First General Announcement
                        data.general = {
                            month: `${messaging.announcements.generalTitle}s`,
                            events: [item],
                        };
                    } else if (item.general && data.general) {
                        // Second or more general announcement
                        data.general.events.push(item);
                    } else if (month) {
                        // Adding additional events to the month.
                        data[item.month].events.push(item);
                    } else {
                        // First event of the month.
                        data[item.month] = {
                            month: item.month,
                            events: [item],
                        };
                    }
                });

            data = Object.keys(data)
                .map((month) => data[month])
                .map((month) => {
                    const events = month.events.sort((b, a) => {
                        const before = b.startDate || b.endDate || b.date;
                        const after = a.startDate || a.endDate || a.date;
                        return moment(before).valueOf() - moment(after).valueOf();
                        // return moment(before).format(dateFormats.day) - moment(after).format(dateFormats.day);
                    });
                    return {
                        month: month.month,
                        events,
                    };
                })
                .sort((b, a) => {
                    const before = monthsArray.indexOf(b.month);
                    const after = monthsArray.indexOf(a.month);

                    return before - after;
                });

            const actionState = { data };

            return { ...state, ...actionState };
        }
        default:
            return state;
    }
};

export const setAnnoucementEntities = createSelector(
    (state) => getEntities(state),
    (entities) => entities?.announcements
);

export const toastAnnoucement = createSelector(
    (state) => getEntities(state),
    (entities) => entities?.announcements?.toast
);

export const getAnnoucements = createSelector(
    (state) => getEntities(state),
    (entities) => entities?.announcements?.data
);
