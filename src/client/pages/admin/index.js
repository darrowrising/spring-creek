import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

// providers
import UserProvider from '../../providers/User.provider';
import NotificationsProvider from '../../providers/Notifications.provider';
// components
import Routes from './index.routes';
// configs
import theme from '../../../configs/theme.config';
// styles
import { GlobalStyle } from './index.styles';
// import { GridStyle } from './index.vendor.styles';
import 'antd/dist/antd.less';
// assets
// import './static/images/favicon.ico';

const themeVariables = theme.variables[theme.name];

render(
  <ThemeProvider theme={themeVariables}>
    <UserProvider>
      <NotificationsProvider>
        <>
          <GlobalStyle />
          <Routes />
        </>
      </NotificationsProvider>
    </UserProvider>
  </ThemeProvider>,
  document.getElementById('app')
);
