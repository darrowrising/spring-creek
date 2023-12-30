import { string, node } from 'prop-types';
import styled from 'styled-components';

import {
  colorStatusActive,
  colorStatusDeactivated,
  colorStatusInactive,
  colorStatusPending,
} from '../../styles/variables';

const handleColor = ($type) => {
  switch ($type) {
    case 'active':
      return colorStatusActive;
    case 'deactivated':
      return colorStatusDeactivated;
    case 'pending':
      return colorStatusPending;
    default:
      return colorStatusInactive;
  }
};

export const Container = styled.div`
  color: ${({ $type }) => handleColor($type)};
  font-weight: bold;
  text-transform: capitalize;
`;

function Status({ type, children, ...rest }) {
  return (
    <Container {...rest} $type={type}>
      {children}
    </Container>
  );
}

Status.propTypes = {
  type: string,
  children: node,
};

Status.defaultProps = {
  type: 'success',
};

export default Status;
