import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import entities from './entities';
// import viewStates from './viewStates';

export default history => combineReducers({
    router: connectRouter(history)
});
