import React from 'react';
import { withRouter } from 'react-router-dom';
import { shape } from 'prop-types';
import { Menu, MenuItem } from '@blueprintjs/core';

import { GAEvent } from '../analytics/Analytics';

import './menu.less';

function onClick(history, url) {
    GAEvent({
        category: 'User',
        action: 'Menu Link Clicked',
        label: url === '/' ? '/' : url.replace('/', ''),
    });

    history.push(url);
}

function MenuComponent(props) {
    const { history } = props;

    return (
        <Menu>
            <MenuItem text="Home" onClick={() => onClick(history, '/')} />
            <MenuItem text="Sacrament Program" onClick={() => onClick(history, '/program')} />
            <MenuItem text="Sacrament Signup" onClick={() => onClick(history, '/sacrament-signup')} />
            <MenuItem text="Announcements" onClick={() => onClick(history, '/announcements')} />
        </Menu>
    );
}

MenuComponent.propTypes = {
    history: shape(),
};

MenuComponent.defaultProps = {
    history: {},
};

export default withRouter(MenuComponent);
