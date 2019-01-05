import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { GAPageView } from '../../components/analytics/Analytics';
import Header from '../../components/header/Header';
import Home from '../home/Home';
import Program from '../program/Program';
import Announcements from '../announcements/Announcements';
import Primary from '../primary/Primary';
import Moderate from '../moderate/Moderate';

import './pageWrapper.less';

export default class PageWrapper extends Component {
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
                    <Route path="/announcements" component={Announcements} />
                    <Route path="/primary" component={Primary} />
                    <Route path="/moderate" component={Moderate} />
                    <Route path="*" component={Home} />
                </Switch>
            </div>
        );
    }
}
