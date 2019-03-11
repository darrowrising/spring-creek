import React from 'react';
import { string } from 'prop-types';
import messaging from '../../configs/messaging';

import './monthHeader.less';

function MonthHeader(props) {
    const { month, type } = props;

    return (
        <header className="month-wrapper">
            <h4 className="month-title">{type === 'general' ? `${messaging.announcements.generalTitle}s` : month}</h4>
            <hr />
        </header>
    );
}

MonthHeader.propTypes = {
    month: string,
    type: string
};

MonthHeader.defaultProps = {
    month: '',
    type: ''
};

export default MonthHeader;
