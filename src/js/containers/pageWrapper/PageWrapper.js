import React, { Component } from 'react';
import { shape } from 'prop-types';
import { Switch, Route } from 'react-router-dom';

// Components
import { GAPageView } from '../../components/analytics/Analytics';
import Header from '../../components/header/Header';
// Views
import Home from '../home/Home';
import Program from '../program/Program';
import Announcements from '../announcements/Announcements';
import Moderate from '../moderate/Moderate';
import SingleEvent from '../singleEvent/SingleEvent';
// Utilities
import { handleURLParams } from '../../utils/qrCodes';
// Styles
import './pageWrapper.less';
/* eslint-disable  react/static-property-placement */ /* TODO: Remove this eslint disable */
export default class PageWrapper extends Component {
    static propTypes = {
        location: shape(),
        history: shape()
    }

    static defaultProps = {
        location: {},
        history: {}
    }

    componentDidMount() {
        const { location, history } = this.props;
        const isQR = handleURLParams(location.search);

        if (isQR) {
            history.push(location.pathname);
        }
    }

    shouldComponentUpdate(next) {
        const { location } = next;
        let pathName = location.pathname;

        if (pathName === '/') pathName = 'home';

        GAPageView(pathName);

        return true;
    }

    render() {
        return (
            <div id="pageWrapper">
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/program" component={Program} />
                    <Route path="/announcements/:event" component={SingleEvent} />
                    <Route path="/announcements" component={Announcements} />
                    <Route path="/moderate" component={Moderate} />
                    <Route path="*" component={Home} />
                </Switch>
            </div>
        );
    }
}
