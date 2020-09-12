import React from 'react';
import { oneOfType, any, string } from 'prop-types';

// components
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
// import Footer from '../../components/Footer/Footer';
// import InfoBar from '../../components/InfoBar/InfoBar';

// utils
// import { getStorage, removeStorage } from '../../utils/localStorage.utils';
// styles
import { Container, Page, PageWrapper, Title } from './Main.styles';

function Main({ children, title }) {
    // const [openDrawer, setMobileDrawer] = useState(false);
    // const animation = getStorage('animation');

    // useEffect(() => {
    //     if (animation) {
    //         removeStorage('animation');
    //     }
    // }, []);

    return (
        <Container>
            <Header />
            <PageWrapper>
                <Menu />
                <Page>
                    { title && <Title>{title}</Title> }
                    {children}
                </Page>
            </PageWrapper>
        </Container>
    );
}

Main.propTypes = {
    children: oneOfType([any]).isRequired,
    title: string
};

Main.defaultProps = {
    title: ''
};

export default Main;
