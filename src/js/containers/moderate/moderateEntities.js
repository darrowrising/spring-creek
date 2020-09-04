import { createSelector } from 'reselect';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';

const initialState = {
    data: []
};

export const moderateEntities = (state = initialState, action) => {
    const { result, type } = action;

    switch (type) {
        case ActionTypes.GET_MODERATE_LIST_REQUEST: {
            const actionState = {
                loading: true,
                error: {}
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.GET_MODERATE_LIST_SUCCESS: {
            const actionState = {
                loading: false,
                error: {},
                data: result
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.GET_MODERATE_LIST_FAILURE: {
            let errorName = messaging.errors.unknown;

            if (result?.includes('permission_denied')) {
                errorName = messaging.errors.firebasePermission;
            }

            const actionState = {
                error: {
                    message: errorName,
                    on: true
                },
                loading: false
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.EDIT_ANNOUNCEMENT_SUCCESS: {
            const newState = { ...state };
            const eventIndex = newState.data.findIndex(item => item.id === result.id);
            newState.data[eventIndex] = result;
            return { ...state, ...newState };
        }
        case ActionTypes.DELETE_ANNOUNCEMENT_SUCCESS: {
            const actionState = {
                data: state.data.filter(item => item.id !== result)
            };

            return { ...state, ...actionState };
        }
        case ActionTypes.APPROVE_ANNOUNCEMENT_SUCCESS: {
            const newState = { ...state };
            const index = newState.data.findIndex(item => item.id === result.id);
            const actionState = newState.data.splice(index);

            return { ...state, ...actionState };
        }
        case ActionTypes.CANCEL_REMOVAL_SUCCESS: {
            const newState = { ...state };
            const index = newState.data.findIndex(item => item.id === result.id);
            const actionState = newState.data.splice(index);

            return { ...state, ...actionState };
        }
        default:
            return state;
    }
};

export const getModerateEntities = createSelector(
    state => getEntities(state),
    entities => entities?.moderate
);
