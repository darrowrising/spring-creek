import { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import { string, number, func } from 'prop-types';
import { lighten } from 'polished';

import { useAdminContext } from '../../providers/admin.provider';
import { signOut } from '../../utils/firebase.utils';
import { hasPermission } from '../../utils/permissions.utils';
import { adminMenu } from '../../configs/menu';
import { colorBlue5 } from '../../styles/variables';
import { media } from '../../styles/variables';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: minmax(100px, max-content) 1fr;
  padding: var(--space-2) 0;

  ${media.tablet} {
    grid-template-rows: 1fr;
    padding: 0;
  }
`;

const List = styled.ul``;
const Item = styled.li`
  background-color: ${({ $isSelected }) => ($isSelected ? lighten(0.5, colorBlue5) : 'transparent')};
  padding: var(--space-3) var(--space-7) var(--space-3) var(--space-5);
  transition: background-color 0.3s ease;
  text-transform: capitalize;
  cursor: ${({ $isSelected }) => ($isSelected ? 'default' : 'pointer')};

  ${media.tablet} {
    padding: var(--space-4) var(--space-5);
    border-bottom: 1px solid var(--color-grey-3);
  }

  & > span {
    font-size: 0.9em;
    font-weight: 500;
    color: var(--color-blue-5);

    ${media.tablet} {
      font-size: 1em;
    }
  }

  ${({ $isSelected }) =>
    $isSelected
      ? ''
      : `
    &:hover {
      background-color: var(--color-grey-3);
    }
  `}
`;

const BottomList = styled.ul`
  border-top: 1px solid var(--color-grey-3);
  padding-top: var(--space-4);

  ${media.tablet} {
    border-top: none;
    padding-top: 0;
  }
`;

const ListItem = ({ label, count, ...rest }) => {
  if (count)
    return (
      <Item {...rest}>
        <Badge count={count} offset={[15, 0]}>
          <span>{label}</span>
        </Badge>
      </Item>
    );

  return (
    <Item {...rest}>
      <span>{label}</span>
    </Item>
  );
};

ListItem.propTypes = {
  label: string,
  count: number,
};

function Menu({ className, onNavigate }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notifications } = useAdminContext();
  const [selected, setSelected] = useState(() => pathname.split('/').pop());

  const handleClick = (path, label) => {
    setSelected(label);
    navigate(path ?? label);

    // Call onNavigate callback if provided (for mobile menu)
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleSignOut = () => {
    signOut();
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Wrapper className={`menu ${className}`.trim()}>
      <List>
        {adminMenu(notifications).map(
          ({ path, label, permissions, ...rest }) =>
            hasPermission(permissions) && (
              <ListItem
                {...rest}
                key={label}
                label={label}
                $isSelected={selected === (path || label)}
                onClick={() => handleClick(path, label)}
              />
            )
        )}
      </List>
      <BottomList>
        <ListItem to="/login" label="sign out" onClick={handleSignOut} />
      </BottomList>
    </Wrapper>
  );
}

Menu.propTypes = {
  className: string,
  onNavigate: func,
};

export default Menu;
