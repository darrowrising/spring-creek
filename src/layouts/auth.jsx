import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-white-1);
  padding: var(--space-5) var(--space-4) var(--space-10);
  width: 100%;
  position: relative;
  height: calc(100vh - 109px);

  ${Loader} {
    position: relative;
    top: 20%;
  }
`;

function AuthLayout() {
  return (
    <Layout>
      <Header hideMenu />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Layout>
  );
}

export default AuthLayout;
