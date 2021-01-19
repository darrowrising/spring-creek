import React from 'react';
import { node } from 'prop-types';

// styles
// import {} from './OldLayout.styles';

function OldLayout({ children, ...rest }) {
    return (
        <div className="page center container" {...rest}>
            <div className="content-width">{children}</div>
        </div>
    );
}

OldLayout.propTypes = {
    children: node.isRequired,
};

// OldLayout.defaultProps = {

// };

export default OldLayout;
