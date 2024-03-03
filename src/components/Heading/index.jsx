import { node, oneOf, string } from 'prop-types';
import styled from 'styled-components';

import { colorBlue2, colorGreen1 } from '../../styles/variables';

// #region MonthHeading
const Header = styled.header`
  display: grid;
  grid-template-columns: var(--space-10) auto 1fr;
  align-items: center;
  height: 3em;
`;

const Line = styled.div`
  height: 1px;
  background-color: var(--color-grey-3);
  width: 100%;
`;

const Month = styled.h3`
  font-family: var(--font-brand);
  color: var(--color-grey-2);
  padding: 0 var(--space-6);
  font-size: 1.7em;
`;

export function MonthHeading({ children }) {
  return (
    <Header>
      <Line />
      <Month>{children}</Month>
      <Line />
    </Header>
  );
}

MonthHeading.propTypes = {
  children: node.isRequired,
};
// #endregion MonthHeading

const StyleHeading = styled.h2`
  color: ${({ $color }) => $color};
  font-family: var(--font-brand);
  font-size: ${({ $size }) => `${$size}rem`};
`;

const handleColor = (color) => {
  switch (color) {
    case 'secondary':
      return colorGreen1;
    default:
      return colorBlue2;
  }
};

const handleSize = (size) => {
  switch (size) {
    case 'sm':
      return '2';
    default:
      return '2.5';
  }
};

function Heading({ children, className, color, size, ...rest }) {
  return (
    <StyleHeading
      className={`${className} heading`.trim()}
      {...rest}
      $color={handleColor(color)}
      $size={handleSize(size)}
    >
      {children}
    </StyleHeading>
  );
}

Heading.propTypes = {
  children: node.isRequired,
  color: oneOf(['primary', 'secondary']),
  size: oneOf(['sm']),
  className: string,
};

// #region PageHeading
export const PageHeading = styled(Heading).attrs({ 'data-testid': 'page-heading' })`
  text-align: center;
  padding: var(--space-3) 0 var(--space-6);
  border-bottom: 1px solid var(--color-grey-2);
`;
// #endregion PageHeading

// #region SubHeading
export const SubHeading = ({ ...rest }) => <Heading as="h3" color="secondary" size="sm" {...rest} />;
// #endregion SubHeading

export default styled(Heading)``;
