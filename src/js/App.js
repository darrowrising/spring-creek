import React from 'react';
// import { Provider } from 'react-redux';
import { render } from 'react-dom';
// import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
// import { Switch, Route } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';

// import { Login } from './authentication/Login';

// import { configureStore } from './store';
// import { PageWrapper } from './components/PageWrapper';

// import './app.less';
// import '../img/favicon_local.png';
// import '../img/favicon_development.png';
// import '../img/favicon.png';

// const history = createHistory();
// const middleware = routerMiddleware(history); // Build the middleware for intercepting and dispatching navigation actions
// const store = configureStore(middleware); // Create a store connected with Redux

// render((
//     <Provider store={store}>
//         <ConnectedRouter history={history}>
//             <Switch>
//                 <Route path="/login" component={Login} />
//                 <Route path="*" component={PageWrapper} />
//             </Switch>
//         </ConnectedRouter>
//     </Provider>
// ), document.getElementById('app'));

render((
    <div>hello world</div>
), document.getElementById('app'));
