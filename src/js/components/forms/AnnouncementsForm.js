/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { func } from 'prop-types';
import {
    FormGroup, InputGroup, Button, ButtonGroup, HTMLSelect, Callout
} from '@blueprintjs/core';
import { Editor } from 'react-draft-wysiwyg';
import { DatePicker } from "@blueprintjs/datetime";
import { EditorState, convertToRaw } from 'draft-js';
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
        saveBtnClicked: func
    };

    static defaultProps = {
        saveBtnClicked: null
    }

    static defaultState = {
        date: new Date(),
        message: EditorState.createEmpty(),
        group: 'Ward',
        title: '',
        firstName: getStorage('name').firstName,
        lastName: getStorage('name').lastName
    }

    constructor(props) {
        super(props);
        this.state = AnnouncementForm.defaultState
    }

    validator = () => {
        const msg = messaging?.errors?.announcementForm;
        const state = { ...this.state };
        const keys = Object.keys(state);
        const fieldErrors = {};

        keys.forEach(field => {
            const isEmpty = state[field] === '';

            if (isEmpty) {
                fieldErrors[field] = msg.requiredField
            }
        });

        if (fieldErrors !== {}) {
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

            setStorage('name', { firstName: state.firstName, lastName: state.lastName });
            saveBtnClicked(true);
            setAnnoucement(state);
            return true;
        } else {
            this.setState({validate});
        }
    }

    handleClear = () => this.setState(AnnouncementForm.defaultState);

    render() {
        const {
            date, title, group, firstName, lastName, message, validate
        } = this.state;
        const maxDate = moment().add(1, 'Y').format(dateFormat.smallDate);
        const minDate = moment().subtract(1, 'M').format(dateFormat.smallDate);
        const dateTime = moment(date).format(dateFormat.dateTime);
        const errors = validate?.fieldErrors;

        return (
            <div className="announcement-form-container">
                { validate?.error && <Callout intent="danger" title={validate.messageHeader}>{validate.message}</Callout> }
                <DatePicker
                    maxDate={new Date(maxDate)}
                    minDate={new Date(minDate)}
                    value={date}
                    onChange={(newDate) => this.handleChange('date', newDate)}
                    timePickerProps={{
                        useAmPm: true,
                        showArrowButtons: true
                    }}
                />
                <div className="event-date">{dateTime}</div>
                <HTMLSelect options={groups} value={group} onChange={(event) => this.handleChange('group', event.currentTarget.value)} />
                <FormGroup
                    labelInfo="(required)"
                    label="Announcement Title"
                    labelFor="title-input"
                    intent={errors?.title ? 'danger' : 'none'}
                    helperText={errors?.title}
                >
                    <InputGroup
                        placeholder="Title"
                        value={title}
                        intent={errors?.title ? 'danger' : 'none'}
                        onChange={() => this.handleChange('title', event.target.value)}
                    />
                </FormGroup>
                <FormGroup
                    labelInfo="(required)"
                    label="Announcement"
                    labelFor="message"
                >
                    <Editor
                        className={errors?.message ? 'message-error' : ''}
                        editorState={message}
                        onEditorStateChange={(content) => this.handleChange('message', content)}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'],
                            fontFamily: {
                                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Pattaya']
                            }
                        }}
                    />
                </FormGroup>
                <div className="row">
                    <FormGroup
                        labelInfo="(required)"
                        label="Your First Name"
                        labelFor="firstName-input"
                        intent={errors?.firstName ? 'danger' : 'none'}
                        helperText={errors?.firstName}
                        className="col-lg-6"
                    >
                        <InputGroup
                            placeholder="First Name"
                            value={firstName}
                            intent={errors?.firstName ? 'danger' : 'none'}
                            onChange={() => this.handleChange('firstName', event.target.value)}
                        />
                    </FormGroup>
                    <FormGroup
                        labelInfo="(required)"
                        label="Your Last Name"
                        labelFor="lastName-input"
                        intent={errors?.lastName ? 'danger' : 'none'}
                        helperText={errors?.lastName}
                        className="col-lg-6"
                    >
                        <InputGroup
                            placeholder="Last Name"
                            value={lastName}
                            intent={errors?.lastName ? 'danger' : 'none'}
                            onChange={() => this.handleChange('lastName', event.target.value)}
                        />
                    </FormGroup>
                </div>
                <ButtonGroup>
                    <Button
                        text="Save"
                        intent="success"
                        onClick={this.handleSave}
                    />
                    <Button
                        text="Clear"
                        onClick={this.handleClear}
                    />
                </ButtonGroup>
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
