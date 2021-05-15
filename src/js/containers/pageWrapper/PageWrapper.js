import React, { useEffect } from 'react';
import { shape } from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';

// Components
import { GAPageView } from '../../components/analytics/Analytics';
import Header from '../../components/header/Header';
// Views
import Home from '../home/Home';
import Program from '../program/Program';
import Announcements from '../announcements/Announcements';
import Moderate from '../moderate/Moderate';
import SingleEvent from '../singleEvent/SingleEvent';
import Questions from '../../../client/pages/Questions/Questions';
// import SacramentSignup from '../../../client/pages/SacramentSignup/SacramentSignup';
// Utilities
import { handleURLParams } from '../../utils/qrCodes';
// Styles
import './pageWrapper.less';

function PageWrapper({ history, location }) {
    useEffect(() => {
        const isQR = handleURLParams(location.search);

        if (isQR) {
            history.push(location.pathname);
        }
    }, []);
    useEffect(() => {
        let pathName = location.pathname;

        if (pathName === '/') pathName = 'home';

        GAPageView(pathName);

        if (pathName.includes('/admin')) window.location.href = `${window.location.origin}/admin`;
    }, [location.pathname]);

    return (
        <div id="pageWrapper">
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/program/:date" component={Program} />
                <Route path="/program" component={Program} />
                <Route path="/announcements/:event" component={SingleEvent} />
                <Route path="/announcements" component={Announcements} />
                <Route path="/moderate" component={Moderate} />
                <Route path="/question/:category" component={Questions} />
                {/* <Route path="/sacrament-signup/:date" component={SacramentSignup} />
                <Route path="/sacrament-signup" component={SacramentSignup} /> */}
                <Route path="*" component={Home} />
            </Switch>
        </div>
    );
}

PageWrapper.propTypes = {
    history: shape().isRequired,
    location: shape().isRequired,
};

export default withRouter(PageWrapper);
