import React, { memo } from 'react';
import { node, bool } from 'prop-types';

// styles
import { StyleHeading } from './styles';

function Heading({ children, secondary, ...rest }) {
  const color = secondary ? 'secondary' : 'primary';

  return (
    <StyleHeading {...rest} color={color}>
      {children}
    </StyleHeading>
  );
}

Heading.propTypes = {
  children: node.isRequired,
  secondary: bool,
};

Heading.defaultProps = {
  secondary: false,
};

export default memo(Heading);
