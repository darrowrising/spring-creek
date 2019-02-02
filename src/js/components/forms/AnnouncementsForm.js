/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { func, shape, bool } from 'prop-types';
import {
    FormGroup, InputGroup, Button, ButtonGroup, HTMLSelect, Callout, Label
} from '@blueprintjs/core';
import { Editor } from 'react-draft-wysiwyg';
import { DatePicker } from "@blueprintjs/datetime";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import moment from 'moment';
import { connect } from 'react-redux';

import dateFormat from '../../configs/dateFormats';
import groups from '../../configs/orgGroups';
import { getStorage, setStorage } from '../../utils/storage';
import { setAnnoucementData } from './annoucementsFormActions';
import messaging from '../../configs/messaging';

import './announcementForm.less';

class AnnouncementForm extends Component {
    static propTypes = {
        saveBtnClicked: func,
        data: shape()
    };

    static defaultProps = {
        saveBtnClicked: null,
        data: null
    }

    static defaultState = {
        date: new Date(),
        message: EditorState.createEmpty(),
        group: '-Select-',
        title: '',
        firstName: getStorage('name')?.firstName || '',
        lastName: getStorage('name')?.lastName || ''
    }

    constructor(props) {
        super(props);
        if (props.data) {
            const blocksFromHTML = convertFromHTML(props.data.message);
            const html = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            props.data.date = new Date(moment(props.data.date).format());
            props.data.message = EditorState.createWithContent(html);
            props.data.firstName = getStorage('name')?.firstName || '';
            props.data.lastName = getStorage('name')?.lastName || '';
        }
        this.state = props.data || AnnouncementForm.defaultState;
    }

    validator = () => {
        const msg = messaging?.errors?.announcementForm;
        const state = { ...this.state };
        const keys = Object.keys(state);
        const fieldErrors = {};

        keys.forEach(field => {
            let isEmpty = state[field] === '';
            console.log('field:', field);
            if (field === 'message') {
                const content = draftToHtml(convertToRaw(state.message.getCurrentContent()));
                console.log('content:', content);
                isEmpty = (/^(<p><\/p>)/).test(content) && content.split('<p>').length >= 2;
            }

            if (field === 'group') {
                isEmpty = /Select/.test(state[field]);
            }

            if (isEmpty) {
                fieldErrors[field] = msg.requiredField
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            return {
                error: true,
                messageHeader: msg.mainHeader,
                message: msg.mainBody,
                fieldErrors
            }
        }

        return false;
    }

    handleChange = (key, content) => this.setState({[key]:content});

    handleSave = () => {
        const state = { ...this.state };
        const { setAnnoucement, saveBtnClicked } = this.props;
        const validate = this.validator();

        if (!validate) {
            state.message = draftToHtml(convertToRaw(state.message.getCurrentContent()));
            state.createdDate = moment().format(dateFormat.longDate);
            state.date = moment(state.date).toString();
            state.moderate = true;

            setStorage('name', { firstName: state.firstName, lastName: state.lastName });
            saveBtnClicked(true);
            setAnnoucement(state);
        } else {
            this.setState({validate});
        }
    }

    handleClear = () => this.setState({validate: false, ...AnnouncementForm.defaultState});

    render() {
        const {
            date, title, group, firstName, lastName, message, validate
        } = this.state;
        const { saveBtnClicked, event } = this.props;
        const maxDate = moment().add(1, 'Y').format();
        const minDate = moment().subtract(1, 'M').format();
        const isEdit = event?.title.length > 0;
        const errors = validate?.fieldErrors;

        return (
            <div className="announcement-form-container container-fluid">
                { !validate?.error && <Callout className="row form-info-message" intent="primary">All announcements and events created or edited will be sent to the Bishopric for moderation before it will be posted.</Callout> }
                { validate?.error && <Callout className="row" intent="danger" title={validate.messageHeader}><div className="col-xs-12 error-message">{validate.message}</div></Callout> }
                <label>When does the event occur or end:</label>
                <div className="row">
                    <DatePicker
                        className="col-sm-4 col-xs-12"
                        maxDate={new Date(maxDate)}
                        minDate={new Date(minDate)}
                        value={date}
                        onChange={(newDate) => this.handleChange('date', newDate)}
                        timePickerProps={{
                            useAmPm: true,
                            showArrowButtons: true
                        }}
                    />
                    <div className="detail-wrapper col-sm-8 col-xs-12">
                        <div className="row">
                            <FormGroup
                                labelInfo="(required)"
                                label="Announcement Title:"
                                labelFor="title-input"
                                intent={errors?.title ? 'danger' : 'none'}
                                helperText={errors?.title}
                                className="col-sm-7 col-xs-12"
                            >
                                <InputGroup
                                    placeholder="Title"
                                    value={title}
                                    intent={errors?.title ? 'danger' : 'none'}
                                    onChange={(event) => this.handleChange('title', event?.target?.value)}
                                />
                            </FormGroup>
                            <div className="col-sm-5 col-xs-12">
                                <label className="select-header">Who is this event for:</label>
                                <HTMLSelect
                                    options={groups}
                                    value={group}
                                    fill
                                    className={errors?.group ? 'message-error' : ''}
                                    onChange={(event) => this.handleChange('group', event?.currentTarget?.value)}
                                />
                            </div>
                        </div>
                        <label className="editor-header">Message:</label>
                        <div className={errors?.message ? 'editor message-error' : 'editor'}>
                            <Editor
                                className={errors?.message ? 'editor message-error' : 'editor'}
                                editorState={message}
                                onEditorStateChange={(content) => this.handleChange('message', content)}
                                toolbar={{
                                    options: ['inline', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'remove', 'history'],
                                    fontFamily: {
                                        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Pattaya']
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="row user-info-section">
                    <FormGroup
                        labelInfo="(required)"
                        label={isEdit ? 'Edited by: Your First Name' : 'Your First Name'}
                        labelFor="firstName-input"
                        intent={errors?.firstName ? 'danger' : 'none'}
                        helperText={errors?.firstName}
                        className="col-sm-6 col-xs-12"
                    >
                        <InputGroup
                            placeholder="First Name"
                            value={firstName}
                            intent={errors?.firstName ? 'danger' : 'none'}
                            onChange={(event) => this.handleChange('firstName', event?.target?.value)}
                        />
                    </FormGroup>
                    <FormGroup
                        labelInfo="(required)"
                        label="Your Last Name"
                        labelFor="lastName-input"
                        intent={errors?.lastName ? 'danger' : 'none'}
                        helperText={errors?.lastName}
                        className="col-sm-6 col-xs-12"
                    >
                        <InputGroup
                            placeholder="Last Name"
                            value={lastName}
                            intent={errors?.lastName ? 'danger' : 'none'}
                            onChange={(event) => this.handleChange('lastName', event?.target?.value)}
                        />
                    </FormGroup>
                    <p className="col-xs-12 user-info-message">First and last name is used for the moderators to help them know who posted the announcement.</p>
                </div>
                <ButtonGroup>
                    <Button
                        text="Save"
                        intent="success"
                        large
                        onClick={this.handleSave}
                    />
                    { !isEdit && (
                        <Button
                            text="Clear"
                            large
                            onClick={this.handleClear}
                        />
                    )}
                </ButtonGroup>
                <Button
                    text={isEdit ? 'Cancel' : 'Close'}
                    className="right"
                    large
                    onClick={saveBtnClicked}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
    setAnnoucement: setAnnoucementData
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnouncementForm);
