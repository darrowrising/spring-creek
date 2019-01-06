import React from 'react';
import { func, shape } from 'prop-types';

import { Button, ButtonGroup } from '@blueprintjs/core';
import { Parser } from 'html-to-react';
import moment from 'moment';

import dateFormats from '../../configs/dateFormats';

import './announcementItem.less';

function handleGroupClassName(group) {
    if (group) {
        return group.split(' ').join('-').toLowerCase();
    }
    return '';
}

function AnnouncementItem(props) {
    const {
        data, onDelete, onEdit, onApproval
    } = props;
    const htmlParse = new Parser();

    return (
        <div className="announcement-container col-sm-5 col-xs-12">
            <div className="row">
                <div className="col-xs-12 content-wrapper">
                    <div className={`group ${handleGroupClassName(data.group)}`.trim()}>{data.group}</div>
                    <div className="content">
                        <div className="row">
                            <h3 className="title col-sm col-xs">{data.title}</h3>
                            <div className="col-sm col-xs event-date">
                                <div className="event-date">{moment(data.date).format(dateFormats.date)}</div>
                                <div className="event-time">{moment(data.date).format(dateFormats.time)}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 message">{htmlParse.parse(data.message)}</div>
                        </div>
                    </div>
                </div>
            </div>
            { data.moderate && (
                <div className="moderate-created-details">
                    <div className="row">
                        <div className="col-sm-6 created-date">
                            <div>Created On:</div>
                            <div>{data.createdDate}</div>
                        </div>
                        <div className="col-sm-6 created-by">
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
