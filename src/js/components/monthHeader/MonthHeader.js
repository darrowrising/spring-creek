import React from 'react';
import { string } from 'prop-types';
import messaging from '../../configs/messaging';

import './monthHeader.less';

function MonthHeader(props) {
    const { month, type } = props;
    const isGeneral = type === 'general';

    return (
        <header className="month-wrapper">
            <h4 className={`month-title ${isGeneral ? 'general-title' : ''}`.trim()}>{isGeneral ? `${messaging.announcements.generalTitle}s` : month}</h4>
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
