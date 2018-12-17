/* TODO: Remove disabled */
/* eslint-disable  */
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { bool } from 'prop-types';
import { Menu, MenuItem } from '@blueprintjs/core';

import './menu.less';

function onClick(history, url) {
    history.push(url);
}

function MenuComponent(props) {
    const { history } = props;

    return (
        <Menu>
            <MenuItem text="Sacrament Program" onClick={() => onClick(history, './program')} />
            <MenuItem text="Announcements" onClick={() => onClick(history, './announcements')} />
        </Menu>
    );
}

// MenuComponent.propTypes = {
//     show: bool
// };
//
// MenuComponent.defaultProps = {
//     show: false
// };

export default withRouter(MenuComponent);
