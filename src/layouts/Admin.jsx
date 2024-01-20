import styled from 'styled-components';
import { darken } from 'polished';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Menu from '../components/Menu';
import { PageHeading } from '../components/Heading';
import AdminProvider from '../providers/admin.provider';
import { colorWhite2 } from '../styles/variables';

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  & > ${Footer} {
    background-color: var(--color-white-1);
    border-top: none;
  }
`;

const Body = styled.div`
  background-color: var(--color-white-1);
  width: 100%;
  flex-grow: 2;
  display: grid;
  grid-template-columns: max-content 1fr;

  ${Loader} {
    position: relative;
    top: 20%;
  }
`;

const Main = styled.main`
  padding: var(--space-5) var(--space-4) var(--space-10);
  background-color: var(--color-white-2);
  border-left: 1px solid ${darken(0.05, colorWhite2)};
  border-bottom: 1px solid ${darken(0.05, colorWhite2)};
  overflow: auto;

  & > ${PageHeading} {
    text-align: left;
    border-bottom: none;
    color: var(--color-blue-5);
    text-transform: capitalize;
  }
`;

function AdminLayout() {
  const { pathname } = useLocation();
  const heading = pathname.split('/').pop().replace('-', ' ');

  return (
    <AdminProvider>
      <AdminContainer>
        <Header />
        <Body className="admin-body">
          <Menu />
          <Main>
            {heading && <PageHeading>{heading}</PageHeading>}
            <Outlet />
          </Main>
        </Body>
        <Footer />
      </AdminContainer>
    </AdminProvider>
  );
}

export default AdminLayout;
