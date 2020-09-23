import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// provider
// import MenuProvider from './providers/Menu.provider';
// analytics
import Analytics from '../../components/Analytics/Analytics';
// pages
import Dashboard from './Dashboard/Dashboard';
import ProgramMaker from './ProgramMaker/ProgramMaker';
import Members from './Members/Members';
import Attendance from './Attendance/Attendance';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import NotFoundPage from '../NotFound/NotFound';
// import Login from './pages/Login/Login';
// components
import PrivateRoute from '../../components/PrivateRoute/PrivateRoute';
// configs
import { adminMenu } from '../../../configs/menu.configs';

const list = {
    Attendance,
    Members,
    ProgramMaker
};

function IndexRoutes() {
    return (
        <BrowserRouter>
            <>
                <Analytics />
                <Switch>
                    { /* main */ }
                    { adminMenu.map(item => (
                        <PrivateRoute exact permissions={item.permissions} path={item.path} component={list[item.component]} />
                    ))}
                    <Route exact path="/admin/login" component={Login} />
                    <Route exact path="/admin/sign-up" component={SignUp} />
                    <PrivateRoute path="/admin" component={Dashboard} />
                    <PrivateRoute path="*" component={NotFoundPage} status={404} />
                </Switch>
            </>
        </BrowserRouter>
    );
}

export default IndexRoutes;
