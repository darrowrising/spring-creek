import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';

import Routes from './routes';
import { GAInitialize } from './components/Analytics';
import UserProvider from './providers/user.provider';
import { colorPrimary } from './styles/variables';
import { GlobalStyle } from './styles/global';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary,
        },
      }}
    >
      <UserProvider>
        <GAInitialize />
        <GlobalStyle />
        <Routes />
      </UserProvider>
    </ConfigProvider>
  </StrictMode>
);
