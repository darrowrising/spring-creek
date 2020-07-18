import { createSelector } from 'reselect';

export const getEntities = createSelector(
    (state) => state?.entities || {},
    (entities) => entities
);

export const getViewStates = createSelector(
    (state) => state?.viewStates || {},
    (viewStates) => viewStates
);
