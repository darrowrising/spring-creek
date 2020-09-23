import React, { useEffect, useState, useContext } from 'react';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';

// providers
import { UserContext } from '../../providers/User.provider';
// utils
import { signOut } from '../../utils/firebase.utils';
import { hasPermission } from '../../utils/permissions.utils';
// cofigs
import { adminMenu } from '../../../configs/menu.configs';
// styles
// import {} from './Menu.styles';

function MenuComp() {
    // hooks
    const { user } = useContext(UserContext);
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
                hasPermission(user?.permissions, item?.permissions || []) && (
                    <Menu.Item key={item.path}>
                        { item.type === 'external'
                            ? <a href={item.path}>{item.text}</a>
                            : <NavLink exact to={item.path}>{item.text}</NavLink>}
                    </Menu.Item>
                )
            ))}
            <hr />
            <Menu.Item>
                <NavLink to="/admin/login" onClick={() => signOut()}>Sign Out</NavLink>
            </Menu.Item>
        </Menu>
    );
}

export default MenuComp;
