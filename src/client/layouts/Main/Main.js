import React, { useEffect, useContext } from 'react';
import { oneOfType, any, string } from 'prop-types';
import { useLocation } from 'react-router-dom';
// providers
import { UserContext } from '../../providers/User.provider';
// components
import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';
// import InfoBar from '../../components/InfoBar/InfoBar';

// utils
// import { getStorage, removeStorage } from '../../utils/localStorage.utils';
import { updateMemberStats } from '../../utils/analytics.utils';
// styles
import { Container, Page, PageWrapper, Title, MenuStyled } from './Main.styles';

function Main({ children, title }) {
    // hooks
    const { user } = useContext(UserContext);
    const { pathname } = useLocation();

    useEffect(() => {
        if (user) {
            const { stats } = user;
            updateMemberStats(user.uid, stats, pathname);
        }
    }, [pathname]);

    return (
        <Container>
            <Header />
            <PageWrapper>
                <MenuStyled />
                <Page>
                    {title && <Title>{title}</Title>}
                    {children}
                </Page>
            </PageWrapper>
        </Container>
    );
}

Main.propTypes = {
    children: oneOfType([any]).isRequired,
    title: string,
};

Main.defaultProps = {
    title: '',
};

export default Main;
