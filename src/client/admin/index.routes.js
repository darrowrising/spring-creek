import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// provider
// import MenuProvider from './providers/Menu.provider';
// analytics
// import Analytics from './components/Analytics';
// pages
import ProgramMaker from './ProgramMaker/ProgramMaker';
import Members from './Members/Members';
import Attendance from './Attendance/Attendance';
// import NotFoundPage from './pages/NotFound/NotFound';
// import Login from './pages/Login/Login';
// components
// import PrivateRoute from './components/PrivateRoute/PrivateRoute';
// configs
import { adminMenu } from '../../configs/menu.configs';

const list = {
    Attendance,
    Members,
    ProgramMaker
};

function IndexRoutes() {
    return (
        <BrowserRouter>
            <>
                <Switch>
                    { /* main */ }
                    <Route path="/admin" component={ProgramMaker} />
                    { adminMenu.map(item => (
                        <Route path={item.path} component={list[item.component]} />
                    ))}
                    {/* <Route path="*" component={NotFoundPage} status={404} /> */}
                </Switch>
            </>
        </BrowserRouter>
    );
}

export default IndexRoutes;
