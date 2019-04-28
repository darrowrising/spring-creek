/* eslint-disable */
import React, { Fragment } from 'react';
import { func, shape } from 'prop-types';

import { Button, ButtonGroup } from '@blueprintjs/core';
import { Parser } from 'html-to-react';
import moment from 'moment';

import dateFormats from '../../configs/dateFormats';
import { groupClassName } from '../../utils/stringParse';

import './announcementItem.less';

function handleDateDays(data) {
    const { startDate, endDate, date } = data;
    const getDay = (dateValue) => moment(dateValue, dateFormats.utc).format(dateFormats.day);
    const end = endDate || date;
    return startDate ? `${getDay(startDate)}-${getDay(end)}` : getDay(end);
}

function AnnouncementItem(props) {
    const {
        data, onDelete, onEdit, onApproval, className, isEdit
    } = props;
    const { group, title } = data;
    const day = handleDateDays(data);
    const endDate = data.endDate || data.date;
    const isRange = data.startDate && data.endDate;
    const dayOfWeek = data.startDate || data.endDate || data.date;
    const dayOfWeekContent = isRange ? 'From' : moment(dayOfWeek, dateFormats.utc).format(dateFormats.dayOfWeek);
    const htmlParse = new Parser();
    const time = data.time && !data.general && !data.allDayEvent;

    return (
        <div className={`announcement-container ${className}`}>
            <div className="row">
                {(dayOfWeek && !data.general) && (
                    <div className="col-xs-2 col-sm-1 day-of-week-wrapper">
                        <div className="day-of-week">{dayOfWeekContent}</div>
                        <div className="day">{day}</div>
                    </div>
                )}
                <div className={`content-wrapper ${(dayOfWeek && !data.general) ? 'col-xs-10 col-sm-11' : 'col-xs-12'}`}>
                    <div className={`group ${groupClassName(group)}`.trim()}>
                        {data.group !== '[Select]' && group}
                    </div>
                    <div className="content">
                        <div className="row">
                            <h3 className="title col-sm col-xs">{title}</h3>
                            {time && <div className="date-time">{moment(data.time, dateFormats.utc).format(dateFormats.time)}</div>}
                        </div>
                        <div className="row">
                            {data.message && <div className="col-xs-12 message">{htmlParse.parse(data.message)}</div>}
                        </div>
                        <div className="row">
                            <div className="col-sm col-xs event-date-wrapper">
                                { endDate && <i className="event-date"><span>ends on</span> {moment(endDate, dateFormats.utc).format(dateFormats.date)}</i>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { (data.moderate && isEdit) && (
                <div className="moderate-created-details">
                    <div className="row">
                        <div className="col-xs-6 created-date">
                            <div>Created On:</div>
                            <div>{moment(data.created.date, dateFormats.utc).format(dateFormats.dateTime)}</div>
                        </div>
                        <div className="col-xs-6 created-by">
                            <div>Created by:</div>
                            <div>{data.firstName} {data.lastName}</div>
                        </div>
                    </div>
                    <div className="row moderate-buttons">
                        <ButtonGroup className="col-sm-2">
                            <Button intent="success" text="approve" onClick={() => onApproval(data)} />
                            <Button intent="primary" text="edit" onClick={() => onEdit(data)} />
                            <Button intent="danger" text="delete" onClick={() => onDelete(data.id)} />
                        </ButtonGroup>
                    </div>
                </div>
            )}
        </div>
    );
}

AnnouncementItem.propTypes = {
    data: shape(),
    onDelete: func,
    onEdit: func,
    onApproval: func
};

AnnouncementItem.defaultProps = {
    data: {},
    onDelete: null,
    onEdit: null,
    onApproval: null
};

export default AnnouncementItem;
