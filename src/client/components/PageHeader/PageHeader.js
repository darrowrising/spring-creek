import React from 'react';
import { node } from 'prop-types';

// styles
import { Header } from './PageHeader.styles';

function PageHeader({ children, ...rest }) {
  return <Header {...rest}>{children}</Header>;
}

PageHeader.propTypes = {
  children: node.isRequired,
};

// PageHeader.defaultProps = {

// };

export default PageHeader;
