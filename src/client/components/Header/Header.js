import React, { useState } from 'react';
import { Drawer } from 'antd';
import { useHistory } from 'react-router-dom';
import useDimensions from 'react-cool-dimensions';
import { MenuOutlined } from '@ant-design/icons';

// components
import Menu from '../Menu/Menu';
// utils
import { GAEvent } from '../../../js/components/analytics/Analytics';
// configs
import { mobileWidthMax } from '../../../configs/menu.configs';
// styles
import { Container, Logo } from './Header.styles';

function Header() {
    // hooks
    const [showDrawer, setDrawer] = useState(false);
    const { push } = useHistory();
    const { ref, width } = useDimensions();
    // handlers
    const handleClick = () => {
        GAEvent({
            category: 'Admin',
            action: 'Header Logo Clicked',
            label: 'Home'
        });
        push('/admin');
    };

    console.log('width:', width, mobileWidthMax);
    return (
        <Container ref={ref}>
            { width <= mobileWidthMax && <MenuOutlined onClick={() => setDrawer(!showDrawer)} /> }
            <Logo onClick={handleClick}>
                Spring Creek Ward
            </Logo>
            <Drawer
                title="Basic Drawer"
                placement="left"
                closable={false}
                onClose={() => setDrawer(false)}
                visible={showDrawer}
            >
                <Menu />
            </Drawer>
        </Container>
    );
}

export default Header;
