import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';

// import { Login } from './authentication/Login';

import { configureStore } from '../store';
import PageWrapper from './pageWrapper/PageWrapper';
import { GAInitialize } from '../components/analytics/Analytics';
import theme from '../../configs/theme.config';

import '../../less/base.less';

const history = createBrowserHistory();
const middleware = routerMiddleware(history); // Build the middleware for intercepting and dispatching navigation actions
const store = configureStore(history, middleware); // Create a store connected with Redux

const themeVariables = theme.variables[theme.name];

GAInitialize();

render(
  <Provider store={store}>
    <ThemeProvider theme={themeVariables}>
      <ConnectedRouter history={history}>
        <BrowserRouter>
          <Switch>
            {/* <Route path="/login" component={Login} /> */}
            <Route path="*" component={PageWrapper} />
          </Switch>
        </BrowserRouter>
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('app')
);
