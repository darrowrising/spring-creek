import React from 'react';
import { string, node } from 'prop-types';

// styles
import { Container } from './Status.styles';

function Status({ type, children, ...rest }) {
  return (
    <Container {...rest} type={type}>
      {children}
    </Container>
  );
}

Status.propTypes = {
  type: string,
  children: node.isRequired,
};

Status.defaultProps = {
  type: 'success',
};

export default Status;
