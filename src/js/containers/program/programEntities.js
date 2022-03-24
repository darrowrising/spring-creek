import { createSelector } from 'reselect';

import { getEntities } from '../../reducers/selectors';
import ActionTypes from '../../configs/constants';
import messaging from '../../configs/messaging';

const initialState = {};

export const programEntities = (state = initialState, action) => {
  const { result, type } = action;

  switch (type) {
    case ActionTypes.GET_PROGRAM_REQUEST: {
      const actionState = {
        loading: true,
        error: {},
      };

      return { ...state, ...actionState };
    }
    case ActionTypes.GET_PROGRAM_SUCCESS: {
      const actionState = {
        loading: false,
        error: {},
      };

      return { ...state, ...actionState };
    }
    case ActionTypes.GET_PROGRAM_FAILURE: {
      let errorName = messaging.errors.unknown;

      if (result?.includes('permission_denied')) {
        errorName = messaging.errors.firebasePermission;
      }

      const actionState = {
        error: {
          message: errorName,
          on: true,
        },
        loading: false,
      };

      return { ...state, ...actionState };
    }
    default:
      return state;
  }
};

export const setProgramEntities = createSelector(
  (state) => getEntities(state),
  (entities) => entities?.program
);
