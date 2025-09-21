import { useState } from 'react';
import styled from 'styled-components';
import { MenuUnfoldOutlined, MenuFoldOutlined, CloseOutlined } from '@ant-design/icons';

import { media } from '../../styles/variables';

import Menu from './index';

const MobileMenuToggle = styled.button`
  display: none;
  z-index: 1000;
  background: var(--color-blue-5);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;

  ${media.tablet} {
    padding: 0;
    display: block;
  }
`;

const MobileMenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  ${media.tablet} {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  }
`;

const MobileMenuContainer = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 1000;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  font-size: 0.7em;

  ${media.tablet} {
    display: block;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-grey-3);
  background: var(--color-blue-5);
  color: white;
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
`;

function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuToggle onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </MobileMenuToggle>
      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenuContainer $isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <span>Admin Menu</span>
          <MobileMenuClose onClick={closeMobileMenu}>
            <CloseOutlined />
          </MobileMenuClose>
        </MobileMenuHeader>
        <Menu onNavigate={closeMobileMenu} />
      </MobileMenuContainer>
    </>
  );
}

export default MobileMenu;
