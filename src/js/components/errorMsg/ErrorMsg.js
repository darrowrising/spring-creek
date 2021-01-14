import React from 'react';
import { string } from 'prop-types';

import './errorMsg.less';

function ErrorMsg(props) {
    const { msg, className, ...rest } = props;

    return (
        <div {...rest} className={`field-error-message ${className}`.trim()}>
            {msg}
        </div>
    );
}

ErrorMsg.propTypes = {
    msg: string,
    className: string,
};

ErrorMsg.defaultProps = {
    msg: '',
    className: '',
};

export default ErrorMsg;
