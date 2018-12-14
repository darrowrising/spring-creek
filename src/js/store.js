import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import ReduxPromise from 'redux-promise';
import createAsyncDescriptorToPromiseMiddleware from './utils/asyncDescriptorToPromiseMiddleware';
import Reducer from './reducers';

export function configureStore(history, ...middleware) {
    const initialState = {};
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        Reducer(history),
        initialState,
        composeEnhancers(
            applyMiddleware(thunk, ReduxPromise, ...middleware, createAsyncDescriptorToPromiseMiddleware(fetch))
        )
    );
    return store;
}
