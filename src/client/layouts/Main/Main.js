import React from 'react';
import { oneOfType, any } from 'prop-types';

// components
import Header from '../../components/Header/Header';
// import Menu from '../../components/Menu/Menu';
// import Footer from '../../components/Footer/Footer';
// import InfoBar from '../../components/InfoBar/InfoBar';

// utils
// import { getStorage, removeStorage } from '../../utils/localStorage.utils';
// styles
import { Container, Page } from './Main.styles';

function Main({ children }) {
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
            <Page>
                {children}
            </Page>
        </Container>
    );
}

Main.propTypes = {
    children: oneOfType([any]).isRequired,
};

// Main.defaultProps = {
// };

export default Main;
