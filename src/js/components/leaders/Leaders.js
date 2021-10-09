import React from 'react';
import { string } from 'prop-types';
// utils
import { idLink } from './leaders.utils';
// styles
import './leaders.less';

function Leaders(props) {
    const { title, value, subValue, className, ...rest } = props;
    const isCSB = (value || '').includes('CSB');

    return (
        <>
            <div {...rest} className={`leaders-container ${className}`}>
                <div className="leaders-wrapper">
                    <span className="leaders-title left">{title}</span>
                    <span className="dot-leaders" />
                    <span className="leaders-value right">{isCSB ? <a href={idLink(value)}>{value}</a> : value}</span>
                </div>
                {subValue && (
                    <div className="row subValue-wrapper">
                        <span className="col-xs-12 center">{subValue}</span>
                    </div>
                )}
            </div>
        </>
    );
}

Leaders.propTypes = {
    title: string,
    value: string,
    subValue: string,
    className: string,
};

Leaders.defaultProps = {
    subValue: '',
    title: '',
    value: 'TBA',
    className: '',
};

export default Leaders;
