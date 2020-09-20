import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
// import {} from 'prop-types';
// utils
import { signOut } from '../../utils/firebase.utils';
// cofigs
import { adminMenu } from '../../../configs/menu.configs';
// styles
// import {} from './Menu.styles';
/* eslint-disable */ /* TODO: Remove this eslint disable */
function MenuComp() {
    // hooks
    const [selected, setSelected] = useState([]);
    const location = useLocation();
    // handlers
    const handleClick = ({ key }) => setSelected(key);

    useEffect(() => {
        const { pathname } = location;
        setSelected([pathname]);
    }, []);

    return (
        <Menu selectedKeys={selected} onClick={handleClick}>
            { adminMenu.map(item => (
                <Menu.Item key={item.path}>
                    { item.type === 'external'
                        ? <a href={item.path}>{item.text}</a>
                        : <NavLink exact to={item.path}>{item.text}</NavLink>
                    }
                </Menu.Item>
            ))}
            <Menu.Item>
                <NavLink to="/admin/login" onClick={() => signOut()}>Sign Out</NavLink>
            </Menu.Item>
        </Menu>
    );
}

// MenuComp.propTypes = {

// };

// MenuComp.defaultProps = {

// };

export default MenuComp;
