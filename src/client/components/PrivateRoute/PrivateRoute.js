import React, { useContext } from 'react';
import { shape, oneOfType, func, arrayOf, string } from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

// utils
import { setStorage } from '../../utils/localStorage.utils';
import { hasPermission } from '../../utils/permissions.utils';
// store
import { UserContext } from '../../providers/User.provider';

const PrivateRoute = ({ component: Component, permissions, ...props }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) return null;
    /* save current location user is trying to link to
     * after they log in, they will be redirected. */
    if (!user && window.location.pathname !== '/admin') {
        setStorage('loginRedirect', window.location.pathname, 'session');
    }
    const canSeeRoute = (innerProps) => {
        const component = hasPermission(user?.permissions, permissions) ? <Component {...innerProps} /> : <Redirect to="/admin/noauth" />;
        return component;
    };

    return (
        <Route
            {...props}
            render={innerProps => (user ? canSeeRoute(innerProps) : <Redirect to="/admin/login" />)}
        />
    );
};

PrivateRoute.propTypes = {
    component: oneOfType([
        shape(),
        func
    ]),
    permissions: arrayOf(
        string
    )
};

PrivateRoute.defaultProps = {
    component: null,
    permissions: []
};

export default PrivateRoute;
