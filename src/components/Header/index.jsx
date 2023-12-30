import styled from 'styled-components';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { bool } from 'prop-types';

import Link from '../Link';
import { GAEvent } from '../Analytics';
import { useUser } from '../../providers/user.provider';
import { wardName } from '../../configs/unit';
import { hasData } from '../../utils/data.utils';
import { colorPrimary, colorBlue5, mobileMaxWidth } from '../../styles/variables';

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  background-color: ${({ $isAdmin }) => ($isAdmin ? colorBlue5 : colorPrimary)};
  color: var(--color-white-2);
  font-size: 2.6rem;
  padding: var(--space-2) var(--space-7);

  @media screen and (max-width: ${mobileMaxWidth}) {
    padding: var(--space-2) var(--space-3);
    padding-left: 50px;
  }
`;

const Logo = styled(Link)`
  display: inline-block;
  color: var(--color-white-2);
  font-family: var(--font-brand);
  width: max-content;

  &&:hover {
    color: var(--color-white-2);
    text-decoration: none;
  }
`;

const StyleDropdown = styled(Dropdown)`
  justify-self: flex-end;
`;

function handleClick() {
  GAEvent({
    category: 'User',
    action: 'Header Logo Clicked',
    label: 'Home',
  });
}

const nav = [
  {
    label: <Link to="/">Home</Link>,
    key: 0,
  },
  {
    label: <Link to="/program">Sacrament Program</Link>,
    key: 1,
  },
  {
    label: <Link to="/announcements">Announcements</Link>,
    key: 2,
  },
  {
    label: <Link to="/admin">Admin</Link>,
    authenticate: true,
    key: 3,
  },
];

function Header({ hideMenu = false }) {
  const { pathname } = useLocation();
  const { user } = useUser();
  const isAdmin = pathname.includes('admin');

  const items = hasData(user) ? nav : nav.filter(({ authenticate }) => !authenticate);

  return (
    <HeaderContainer $isAdmin={isAdmin}>
      <Logo to="/" onClick={handleClick}>
        {wardName}
      </Logo>
      {!hideMenu && (
        <StyleDropdown menu={{ items }} trigger={['click']}>
          <MenuOutlined />
        </StyleDropdown>
      )}
    </HeaderContainer>
  );
}

Header.propTypes = {
  hideMenu: bool,
};

export default Header;
