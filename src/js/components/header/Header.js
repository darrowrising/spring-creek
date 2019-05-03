import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popover } from '@blueprintjs/core';

import Menu from '../menu/Menu';
import { GAEvent } from '../analytics/Analytics';

import './header.less';

function handleClick() {
    GAEvent({
        category: 'User',
        action: 'Header Logo Clicked',
        label: 'Home'
    });
}

function Header() {
    return (
        <header className="header-container row">
            <h1 className="logo col-xs-10"><Link className="logo-link" to="/" onClick={handleClick}>Spring Creek Ward</Link></h1>
            <Popover className="menu-icon col-xs-2" interactionKind="click-target" content={<Menu />} position="bottom-right">
                <Icon icon="menu" iconSize="32" />
            </Popover>
        </header>
    );
}

export default Header;
