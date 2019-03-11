/* eslint-disable */
import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import {
    FormGroup, InputGroup, Button, ButtonGroup, HTMLSelect, Callout, Label, Switch, Divider, Tooltip, Icon
} from '@blueprintjs/core';
import { Editor } from 'react-draft-wysiwyg';
import { DateInput, DateRangeInput, TimePicker } from '@blueprintjs/datetime';
import {
    EditorState, convertToRaw, convertFromHTML, ContentState
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import moment from 'moment';
import { connect } from 'react-redux';

import { GAEvent } from '../analytics/Analytics';
import AnnouncementItem from '../announcementItem/AnnouncementItem';
import dateFormats from '../../configs/dateFormats';
import groups from '../../configs/orgGroups';
import { getStorage, setStorage } from '../../utils/storage';
import { setAnnoucementData } from './annoucementsFormActions';
import messaging from '../../configs/messaging';
import MonthHeader from '../monthHeader/MonthHeader';

import './announcementForm.less';

const handleEditorContent = (message) => draftToHtml(convertToRaw(message.getCurrentContent()));

class AnnouncementForm extends Component {
    static propTypes = {
        saveBtnClicked: func,
        data: shape(),
        setAnnoucement: func,
        event: shape()
    };

    static defaultProps = {
        saveBtnClicked: null,
        data: null,
        setAnnoucement: null,
        event: {}
    }

    static defaultState = {
        allDayEvent: false,
        general: false,
        startDate: null,
        endDate: null,
        time: null,
        message: EditorState.createEmpty(),
        group: '',
        title: '',
        isRange: false,
        general: false,
        firstName: getStorage('name')?.firstName || '',
        lastName: getStorage('name')?.lastName || ''
    }

    constructor(props) {
        const newProps = props;
        super(props);
        if (newProps.data) {
            const blocksFromHTML = convertFromHTML(newProps.data.message);
            const html = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            newProps.data.startDate = new Date(moment(props.data.startDate).format());
            newProps.data.endDate = new Date(moment(props.data.endDate).format());
            newProps.data.time = new Date(moment(props.data.time).format());
            newProps.data.message = EditorState.createWithContent(html);
            newProps.data.firstName = getStorage('name')?.firstName || '';
            newProps.data.lastName = getStorage('name')?.lastName || '';
        }
        this.state = newProps.data || AnnouncementForm.defaultState;
    }

    validator = () => {
        const msg = messaging?.errors?.announcementForm;
        const state = { ...this.state };
        const keys = Object.keys(state);
        const fieldErrors = {};
        const css = 'background: #db3737; color: white; padding: 0 20px; font-size: 120%;';

        keys.forEach((field) => {
            let GAError = false;
            const approvedFields = [
                'title',
                'endDate'
            ]; // Fields that need validation that don't have specific needs.
            let isEmpty = approvedFields.indexOf(field) !== -1 && (state[field] === '' || !state[field]);

            if (field === 'message') {
                const content = draftToHtml(convertToRaw(state.message.getCurrentContent()));
                isEmpty = (/^(<p><\/p>)/).test(content) && content.split('<p>').length >= 2;
            }

            if (field === 'group') {
                isEmpty = /Select/.test(state[field]) || !state[field];
            }

            if (state.isRange && field === 'startDate' && !state[field]) {
                isEmpty = true;
            }

            if (isEmpty) {
                fieldErrors[field] = msg.requiredField;
                GAError = true;
                console.info(`%c Validation error with field ${field}`, css);
            }

            if (GAError) {
                GAEvent({
                    category: 'Error Logged',
                    action: 'Save | Announcement Form',
                    label: `Field ${field}`
                });
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            return {
                error: true,
                messageHeader: msg.mainHeader,
                message: msg.mainBody,
                fieldErrors
            };
        }

        return false;
    }

    handleChange = (key, value) => {
        let val = value;

        if (key === 'rangeDate') {
            val = [{
                k: 'startDate',
                v: val[0]
            }, {
                k: 'endDate',
                v: val[1]
            }];
        }

        if (Array.isArray(val)) {
            val.forEach(item => this.setState({ [item.k]: item.v }));
            return;
        }

        if (key === 'isRange' && value) {
            this.setState({
                [key]: val,
                time: null
            })
        }

        if (key === 'isRange' && !value) {
            this.setState({
                [key]: val,
                startDate: null
            })
        }

        this.setState({ [key]: val });
    };

    handleSave = () => {
        const state = { ...this.state };
        const { setAnnoucement, saveBtnClicked } = this.props;
        const validate = this.validator();

        if (!validate) {
            state.message = draftToHtml(convertToRaw(state.message.getCurrentContent()));
            state.createdDate = moment().format(dateFormats.longDate);
            state.endDate = moment(state.endDate).toString();
            state.moderate = true;

            if (state.startDate) {
                state.startDate = moment(state.startDate).toString();
            }

            if (state.time) {
                state.time = moment(state.time).toString();
            }

            setStorage('name', { firstName: state.firstName, lastName: state.lastName });
            saveBtnClicked(true);
            setAnnoucement(state);
        } else {
            this.setState({ validate });
        }
    }

    handleClear = () => this.setState({ validate: false, ...AnnouncementForm.defaultState });

    handleAnnouncementItemData = () => {
        const data = {...this.state};
        data.message = handleEditorContent(data.message);
        data.date = data.endDate;

        return data;
    }

    render() {
        const {
            allDayEvent, general, startDate, endDate, time, title, group, firstName, lastName, message, validate, isRange
        } = this.state;
        const { saveBtnClicked, event } = this.props;
        const maxDate = moment().add(1, 'Y').format();
        const minDate = moment().subtract(1, 'M').format();
        const isEdit = event?.title && event?.title.length > 0;
        const errors = validate?.fieldErrors;
        const generalText = general ? 'yes' : 'no';
        const isRangeText = isRange ? 'on' : 'off';
        const isAllDay = allDayEvent ? 'yes' : 'no';
        const date = startDate || endDate;
        const DateElement = isRange ? (
            <div className="range-date-wrapper">
                <DateRangeInput
                    formatDate={date => moment(date).format(dateFormats.date)}
                    parseDate={date => moment(date).format(dateFormats.date)}
                    onChange={(date) => this.handleChange('rangeDate', date)}
                    value={[startDate, endDate]}
                    maxDate={new Date(maxDate)}
                    minDate={new Date(minDate)}
                    shortcuts={false}
                    allowSingleDayRange
                    startInputProps={{
                        intent: errors?.startDate ? 'danger' : 'none',
                        helperText: errors?.startDate
                    }}
                    endInputProps={{
                        intent: errors?.endDate ? 'danger' : 'none',
                        helperText: errors?.endDate
                    }}
                />
            </div>
        ) : (
            <div className="single-date-wrapper">
                <DateInput
                    formatDate={date => moment(date).format(dateFormats.date)}
                    placeholder='Event Date'
                    parseDate={date => moment(date).format(dateFormats.date)}
                    onChange={(date) => this.handleChange('endDate', date)}
                    value={endDate}
                    maxDate={new Date(maxDate)}
                    minDate={new Date(minDate)}
                    inputProps={{
                        intent: errors?.endDate ? 'danger' : 'none'
                    }}
                    for="eventDate"
                />
            </div>
        );
        const TimeElement = isRange ? null : (
            <TimePicker useAmPm value={time} disabled={general || allDayEvent} onChange={(time) => this.handleChange('time', time)} />
        )

        return (
            <div className="announcement-form-container container-fluid">
                { !validate?.error && <Callout className="row form-info-message" intent="primary">All announcements and events created or edited will be sent to the Bishopric for moderation before it will be posted.</Callout> }
                { validate?.error && <Callout className="row" intent="danger" title={validate.messageHeader}><div className="col-xs-12 error-message">{validate.message}</div></Callout> }
                <div className="row editor-container">
                    <div className="col-xs-12 col-sm-4">
                        <div>
                            <FormGroup
                                labelInfo=<em className='required-symbol'>*</em>
                                label="Announcement Title"
                                labelFor="title-input"
                                intent={errors?.title ? 'danger' : 'none'}
                                helperText={errors?.title}
                            >
                                <InputGroup
                                    placeholder="Title"
                                    value={title}
                                    intent={errors?.title ? 'danger' : 'none'}
                                    onChange={e => this.handleChange('title', e?.target?.value)}
                                />
                            </FormGroup>
                        </div>
                        <div>
                            <Label className="select-header">Who is this event for: <em className="required-symbol">*</em></Label>
                            <HTMLSelect
                                options={groups}
                                value={group}
                                fill
                                className={errors?.group ? 'message-error' : ''}
                                onChange={e => this.handleChange('group', e?.currentTarget?.value)}
                            />
                        </div>
                        <Divider className="section-divider" />
                        <div className="switch-wrapper">
                            <Switch
                                checked={isRange}
                                label={<span>Date Range: <em className={isRangeText}>{isRangeText}</em></span>}
                                onChange={() => this.handleChange('isRange', !isRange)}
                            />
                        </div>
                        <div>
                            <label id="eventDate">When does the event occur or end: <em className="required-symbol">*</em></label>
                            {DateElement}
                        </div>
                        <div className="all-day-switch-wrapper">
                            <Switch
                                className="all-day-switch"
                                checked={allDayEvent}
                                label={<span>All day event: <em className={isAllDay}>{isAllDay}</em></span>}
                                onChange={() => this.handleChange('allDayEvent', !allDayEvent)}
                            />
                        </div>
                        <div className="time-wrapper">
                            {TimeElement}
                            {!isRange && <Button
                                className="clear-time"
                                text="Rest Time"
                                small
                                disabled={general || !time || allDayEvent}
                                onClick={() => this.handleChange('time', null)}
                            />}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        <Label className="editor-header">Message <em className="required-symbol">*</em></Label>
                        <div className={errors?.message ? 'editor message-error' : 'editor'}>
                            <Editor
                                className={errors?.message ? 'editor message-error' : 'editor'}
                                editorState={message}
                                onEditorStateChange={content => this.handleChange('message', content)}
                                toolbar={{
                                    options: ['inline', 'list', 'textAlign', 'colorPicker', 'link', 'remove', 'history'],
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="preview row">
                    <div className="preview-controls col-xs-12 col-sm-4">
                        <p className="preview-title">Announcement Preview</p>
                        <div className="switch-wrapper">
                            <Switch
                                className="general-switch"
                                checked={general}
                                label={<span>{messaging.announcements.generalTitle}? <em className={generalText}>{generalText}</em></span>}
                                onChange={() => this.handleChange('general', !general)}
                            />
                        {/*}<Tooltip className="tooltip" position="top" content={`A ${messaging.announcements.generalTitle} is not an event but an announcement that you want to share for a set time.
                                You are required to add an end date so the site knows when to turn your ${messaging.announcements.generalTitle} off.`}>
                                <Icon icon="help" />
                            </Tooltip>*/}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        {(date || general) && <MonthHeader type={general ? 'general' : 'month'} month={moment(date).format(dateFormats.month)} /> }
                        <AnnouncementItem data={this.handleAnnouncementItemData()} />
                    </div>
                </div>
                <div className="row user-info-section">
                    <FormGroup
                        labelInfo={<em className="required-symbol">*</em>}
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
                            onChange={e => this.handleChange('firstName', e?.target?.value)}
                        />
                    </FormGroup>
                    <FormGroup
                        labelInfo=<em className="required-symbol">*</em>
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
                            onChange={e => this.handleChange('lastName', e?.target?.value)}
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
