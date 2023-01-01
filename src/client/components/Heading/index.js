import React from 'react';
import { node, bool } from 'prop-types';
import styled from 'styled-components';

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

export default styled(Heading)``;
