import React from 'react';
// import { Icon, Popover } from '@blueprintjs/core';

// import Menu from '../menu/Menu';
import { GAEvent } from '../../../js/components/analytics/Analytics';

// styles
import { Container, Logo } from './Header.styles';

function Header() {
    const handleClick = () => {
        GAEvent({
            category: 'Admin',
            action: 'Header Logo Clicked',
            label: 'Home'
        });
    };

    return (
        <Container>
            <Logo onClick={handleClick}>
                Spring Creek Ward
            </Logo>
        </Container>
    );
}

export default Header;
