import { NavLink as RouterNavLink } from 'react-router-dom';
import styled from 'styled-components';
import { node, string } from 'prop-types';

const base = `
  color: var(--color-link);
  transition: all 0.3s ease;

  &&:hover {
    color: var(--color-primary);
  }
`;

const NavLink = styled(RouterNavLink)`
  ${base}
`;

const AnchorLink = styled.a`
  ${base}
`;

function Link({ children, href, ...rest }) {
  if (href)
    return (
      <AnchorLink href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </AnchorLink>
    );
  return <NavLink {...rest}>{children}</NavLink>;
}

Link.propTypes = {
  children: node,
  href: string,
};

export default styled(Link)``;
