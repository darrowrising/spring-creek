/* TODO: Remove disabled */
/* eslint-disable  */
import React from 'react';
import { string, node } from 'prop-types';

import { groupClassName } from '../../utils/stringParse';

import './badge.less';

function Badge(props) {
    const { intent, className, children, ...rest } = props;

    return (
        <div {...rest} className={`badge ${groupClassName(intent)} ${className}`.trim()}>
            {children}
        </div>
    );
}

Badge.propTypes = {
    intent: string,
    children: node,
    className: string,
};

Badge.defaultProps = {
    intent: '',
    children: null,
    className: '',
};

export default Badge;
