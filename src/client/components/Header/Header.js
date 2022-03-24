import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useDimensions from 'react-cool-dimensions';

// components
import Menu from '../Menu/Menu';
// utils
import { GAEvent } from '../../../js/components/analytics/Analytics';
// configs
import { mobileWidthMax } from '../../../configs/menu.configs';
// styles
import { Container, Logo, MenuIconStyled, DrawerStyled } from './Header.styles';

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
      label: 'Home',
    });
    push('/admin');
  };

  return (
    <Container ref={ref}>
      {width <= mobileWidthMax && <MenuIconStyled onClick={() => setDrawer(!showDrawer)} />}
      <Logo onClick={handleClick}>Spring Creek Ward</Logo>
      <DrawerStyled
        title="Spring Creek"
        placement="left"
        closable={false}
        onClose={() => setDrawer(false)}
        visible={showDrawer}
      >
        <Menu />
      </DrawerStyled>
    </Container>
  );
}

export default Header;
