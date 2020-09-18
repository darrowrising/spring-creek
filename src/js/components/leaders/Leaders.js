import React from 'react';
import { string } from 'prop-types';

import './leaders.less';

function Leaders(props) {
    const {
        title,
        value,
        subValue,
        className,
        ...rest
    } = props;

    return (
        <>
            { value ? (
                <div {...rest} className={`leaders-container ${className}`}>
                    <div className="leaders-wrapper">
                        <span className="leaders-title left">{title}</span>
                        <span className="dot-leaders" />
                        <span className="leaders-value right">{value}</span>
                    </div>
                    {
                        subValue
                        && (
                            <div className="row subValue-wrapper">
                                <span className="col-xs-12 center">{subValue}</span>
                            </div>
                        )
                    }
                </div>
            ) : null }
        </>
    );
}

Leaders.propTypes = {
    title: string,
    value: string,
    subValue: string,
    className: string
};

Leaders.defaultProps = {
    subValue: '',
    title: '',
    value: '',
    className: ''
};

export default Leaders;
