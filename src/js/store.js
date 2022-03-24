import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import ReduxPromise from 'redux-promise';
// import createAsyncDescriptorToPromiseMiddleware from './utils/asyncDescriptorToPromiseMiddleware';
import firebaseDispatchMiddleware from './utils/firebaseDispatchhMiddleware';
import Reducer from './reducers';

export function configureStore(history, ...middleware) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    Reducer(history),
    composeEnhancers(applyMiddleware(thunk, ReduxPromise, ...middleware, firebaseDispatchMiddleware(fetch)))
  );
  return store;
}
