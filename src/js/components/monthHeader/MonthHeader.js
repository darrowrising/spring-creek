import React from 'react';
import { string } from 'prop-types';
import messaging from '../../configs/messaging';

import './monthHeader.less';

function MonthHeader(props) {
    const { month, type, title } = props;
    const isGeneral = type === 'general';
    const text = title || (isGeneral ? `${messaging.announcements.generalTitle}s` : month);

    return (
        <header className="month-wrapper">
            <h4 className={`month-title ${isGeneral ? 'general-title' : ''}`.trim()}>{text}</h4>
            <hr />
        </header>
    );
}

MonthHeader.propTypes = {
    month: string,
    type: string,
    title: string,
};

MonthHeader.defaultProps = {
    month: '',
    type: '',
    title: '',
};

export default MonthHeader;
