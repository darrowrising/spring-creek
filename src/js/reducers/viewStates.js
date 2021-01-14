import { combineReducers } from 'redux';

import { programViewStates } from '../containers/program/programViewStates';

export default combineReducers({
    program: programViewStates,
});
