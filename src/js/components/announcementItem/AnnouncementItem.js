import React from 'react';
import { func, shape } from 'prop-types';

import { Button, ButtonGroup } from '@blueprintjs/core';
import { Parser } from 'html-to-react';

function AnnouncementItem(props) {
    const {
        data, onDelete, onEdit, onApproval
    } = props;
    const htmlParse = new Parser();

    return (
        <div className="announcement-container">
            <div className="row">
                <div className="col-sm-2 group">{data.group}</div>
                <div className="col-sm-2 title">{data.title}</div>
                <div className="col-sm-2 event-date">{data.date}</div>
                <div className="col-sm-6 message">{htmlParse.parse(data.message)}</div>
            </div>
            { data.moderate && (
                <div className="row">
                    <div className="col-sm-4 created-date">Created On: {data.createdDate}</div>
                    <div className="col-sm-4 created-by">Created by: {data.firstName} {data.lastName}</div>
                    <ButtonGroup className="col-sm-2">
                        <Button intent="success" text="approve" onClick={() => onApproval(data)} />
                        <Button intent="primary" text="edit" onClick={() => onEdit(data)} />
                        <Button intent="danger" text="delete" onClick={() => onDelete(data.id)} />
                    </ButtonGroup>
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
    onDelete: '',
    onEdit: '',
    onApproval: ''
};

export default AnnouncementItem;
