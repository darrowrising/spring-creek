import { combineReducers } from 'redux';

import { programEntities } from '../containers/program/programEntities';

export default combineReducers({
    program: programEntities
});
