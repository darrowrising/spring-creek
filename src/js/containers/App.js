import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// import { Login } from './authentication/Login';

import { configureStore } from '../store';
import PageWrapper from './pageWrapper/PageWrapper';
import { GAInitialize } from '../components/analytics/Analytics';

import '../../less/base.less';

const history = createHistory();
const middleware = routerMiddleware(history); // Build the middleware for intercepting and dispatching navigation actions
const store = configureStore(history, middleware); // Create a store connected with Redux

GAInitialize();

render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                { /* <Route path="/login" component={Login} /> */ }
                <Route path="*" component={PageWrapper} />
            </Switch>
        </ConnectedRouter>
    </Provider>
), document.getElementById('app'));
