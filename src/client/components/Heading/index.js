import React from 'react';
import { node } from 'prop-types';

// styles
import { StyleHeading } from './styles';

function Heading({ children, ...rest }) {
    return <StyleHeading {...rest}>{children}</StyleHeading>;
}

Heading.propTypes = {
    children: node.isRequired,
};

export default Heading;
