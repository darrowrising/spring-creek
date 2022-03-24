import React, { useEffect, useState, useContext } from 'react';
import { Menu, Badge } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';

// providers
import { UserContext } from '../../providers/User.provider';
import { NotificationsContext } from '../../providers/Notifications.provider';
// utils
import { signOut } from '../../utils/firebase.utils';
import { hasPermission } from '../../utils/permissions.utils';
// cofigs
import { adminMenu } from '../../../configs/menu.configs';
// styles
// import {} from './Menu.styles';

function MenuComp({ ...rest }) {
  // hooks
  const { user } = useContext(UserContext);
  const notes = useContext(NotificationsContext);
  const [selected, setSelected] = useState([]);
  const location = useLocation();
  // handlers
  const handleClick = ({ key }) => setSelected(key);

  useEffect(() => {
    const { pathname } = location;
    setSelected([pathname]);
  }, []);

  return (
    <Menu selectedKeys={selected} onClick={handleClick} {...rest}>
      {adminMenu.map(
        (item) =>
          hasPermission(user?.permissions, item?.permissions || []) && (
            <Menu.Item key={item.path}>
              <Badge count={((notes || [])[item?.notification] || []).length} offset={[13, 7]}>
                {item.type === 'external' ? (
                  <a href={item.path}>{item.text}</a>
                ) : (
                  <NavLink exact to={item.path}>
                    {item.text}
                  </NavLink>
                )}
              </Badge>
            </Menu.Item>
          )
      )}
      <hr />
      <Menu.Item>
        <NavLink to="/admin/login" onClick={() => signOut()}>
          Sign Out
        </NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuComp;
