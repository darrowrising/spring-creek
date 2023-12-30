import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-white-1);
  display: flex;
  justify-content: center;
  padding: var(--space-5) var(--space-4) var(--space-10);
  width: 100%;
  flex-grow: 2;
  position: relative;

  & > div {
    max-width: 960px;
  }

  ${Loader} {
    position: relative;
    top: 20%;
  }
`;

function CenterLayout() {
  return (
    <CenterContainer>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </CenterContainer>
  );
}

export default CenterLayout;
