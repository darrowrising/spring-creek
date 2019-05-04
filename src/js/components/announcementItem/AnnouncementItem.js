/* eslint-disable */
import React, { Fragment } from 'react';
import { func, shape, bool, string } from 'prop-types';

import { Button, ButtonGroup, Icon } from '@blueprintjs/core';
import { Parser } from 'html-to-react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';

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
        data, onDelete, onEdit, onApproval, className, isEdit, onCancel, lpLink
    } = props;
    const event = { ...data };
    const { group, title, remove } = event;
    const day = handleDateDays(event);
    const endDate = event?.endDate || event?.date;
    const isRange = event?.startDate && event?.endDate;
    const dayOfWeek = event?.startDate || event?.endDate || event?.date;
    const dayOfWeekContent = isRange ? 'From' : moment(dayOfWeek, dateFormats.utc).format(dateFormats.dayOfWeek);
    const htmlParse = new Parser();
    const time = data?.time && !event?.general && !event?.allDayEvent;
    const lastEdited = event?.edited && !event?.remove ? (() => {
        const edited = event?.edited?.length - 1;
        return event.edited[edited];
    })() : false;
    const isRemoval = event?.remove && typeof event?.remove === 'object';
    const eventTypeClass = event?.general ? 'general' : 'regular';

    return (
        <div className={`announcement-container ${eventTypeClass} ${className}`.trim()}>
            <div className="row">
                {(dayOfWeek && !event?.general) && (
                    <div className="col-xs-2 col-sm-1 day-of-week-wrapper">
                        <div className="day-of-week">{dayOfWeekContent}</div>
                        <div className="day">{day}</div>
                    </div>
                )}
                <div className={`content-wrapper ${(dayOfWeek && !event?.general) ? 'col-xs-10 col-sm-11' : 'col-xs-12'}`}>
                    <div className={`group ${groupClassName(group)}`.trim()}>
                        {event?.group !== '[Select]' && group}
                    </div>
                    <div className="content">
                        <div className="row content-header">
                            <h3 className="title col-sm col-xs">{title}</h3>
                            {time && <div className="date-time">{moment(event.time, dateFormats.utc).format(dateFormats.time)}</div>}
                            {lpLink && (
                                <Link className="event-landing-page-link" to={`/announcements/${event.uid}`}>
                                    <Icon icon="double-chevron-right" />
                                </Link>
                            )}
                        </div>
                        <div className="row">
                            {event?.message && <div className="col-xs-12 message">{htmlParse.parse(data.message)}</div>}
                        </div>
                        <div className="row">
                            <div className="col-sm col-xs event-date-wrapper">
                                { endDate && <i className="event-date"><span>ends on</span> {moment(endDate, dateFormats.utc).format(dateFormats.date)}</i>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { isEdit && (
                <div className="moderate-created-details">
                    <div className="row">
                        <div className="col-xs-6 created">
                            <h6>Created</h6>
                            <div>by: {event?.created?.name}</div>
                            <div>on: {moment(event?.created?.date, dateFormats.utc).format(dateFormats.dateTime)}</div>
                        </div>
                        { lastEdited && (
                            <div className="col-xs-6 edited">
                                <h6>Edited</h6>
                                <div>by: {lastEdited.name}</div>
                                <div>on: {moment(lastEdited.date, dateFormats.utc).format(dateFormats.dateTime)}</div>
                            </div>
                        )}
                        { isRemoval && (
                            <div className="col-xs-6 edited">
                                <h6>Remove Request</h6>
                                <div>by: {remove?.name}</div>
                                <div>on: {moment(remove?.date, dateFormats.utc).format(dateFormats.dateTime)}</div>
                                <div style={{marginTop: '10px'}}>reason: {remove?.reason}</div>
                            </div>
                        )}
                    </div>
                    <div className="row moderate-buttons">
                        {!isRemoval && (
                            <ButtonGroup className="col-sm-2">
                                <Button intent="success" text="approve" onClick={() => onApproval(data)} />
                                <Button intent="primary" text="edit" onClick={() => onEdit(data)} />
                                <Button intent="danger" text="delete" onClick={() => onDelete(data.id)} />
                            </ButtonGroup>
                        )}
                        {isRemoval && (
                            <ButtonGroup className="col-sm-2">
                                <Button intent="danger" text="delete" onClick={() => onDelete(data.id)} />
                                <Button intent="default" text="cancel" onClick={() => onCancel(data)} />
                            </ButtonGroup>
                        )}
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
    onApproval: func,
    onCancel: func,
    lpLink: bool,
    className: string
};

AnnouncementItem.defaultProps = {
    data: {},
    onDelete: null,
    onEdit: null,
    onApproval: null,
    onCancel: null,
    lpLink: false,
    className: ''
};

export default withRouter(AnnouncementItem);
