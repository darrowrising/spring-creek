import styled from 'styled-components';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { bool } from 'prop-types';

import Link from '../Link';
import { GAEvent } from '../Analytics';
import { useUser } from '../../providers/user.provider';
import { hasData } from '../../utils/data.utils';
import { dayjs } from '../../utils/date.utils';
import { wardName } from '../../configs/unit';
import { headerNav } from '../../configs/menu';
import { dateSimple } from '../../configs/dateFormats';
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

function Header({ hideMenu = false }) {
  const { pathname } = useLocation();
  const { user } = useUser();
  const isAdmin = pathname.includes('admin');

  const items = headerNav
    .filter(({ authenticate }) => {
      const isUserLoggedIn = hasData(user);
      if (authenticate && isUserLoggedIn) return true;
      if (authenticate) return false;
      return true;
    })
    .flatMap(({ path, text, expire, ...rest }) => {
      const isExpired = expire && dayjs(expire, dateSimple) < dayjs();
      return isExpired ? [] : { label: <Link to={path}>{text}</Link>, ...rest };
    });

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
