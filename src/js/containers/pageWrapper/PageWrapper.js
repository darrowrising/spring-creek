/* TODO: Remove disabled */
/* eslint-disable  */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
//import {} from 'prop-types';
import Header from '../../components/header/Header';
import Home from '../home/Home';
import Program from '../program/Program';
import Announcements from '../announcements/Announcements';

import './pageWrapper.less';

function PageWrapper(props) {
    return (
        <div id="pageWrapper">
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/program" component={Program} />
                <Route path="/announcements" component={Announcements} />
            </Switch>
        </div>
    );
}

//PageWrapper.propTypes = {

//};

//PageWrapper.defaultProps = {

//};

export default PageWrapper;
