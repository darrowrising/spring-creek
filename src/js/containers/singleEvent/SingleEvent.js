/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component, Fragment, Suspense, lazy } from 'react';
//import {} from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import shortId from 'shortid';
import { Button, Dialog, Toaster } from '@blueprintjs/core';
import moment from 'moment';

// components
const AnnouncementForm = lazy(() => import('../../components/forms/announcementForm/AnnouncementsForm'));
const AnnouncementItem = lazy(() => import('../../components/announcementItem/AnnouncementItem'));
const MonthHeader = lazy(() => import('../../components/monthHeader/MonthHeader'));
const RemoveRequest = lazy(() => import('../../components/forms/simpleRequest/SimpleRequest'));
// utilites
import { GAEvent } from '../../components/analytics/Analytics';
import { callSingleEvent, removeEvent } from './singleEvent.actions';
import { getEvent, toastEvent } from './singleEvent.entities';
// configs
import dateFormats from '../../configs/dateFormats';
// style
import './singleEvent.less';

class SingleEvent extends Component {
    //static propTypes = {
    //
    //};

    //static defaultProps = {
    //
    //}

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            dialogTitle: "",
            editDialog: false,
            removeDialog: false
        }
        this.refHandlers = {
            toaster: (ref) => this.toaster = ref
        }
    }

    componentDidMount() {
        const { callEvent, match } = this.props;
        const { params } = match;
        callEvent(params?.event);
    }

    shouldComponentUpdate(nextProps) {
        const { match } = nextProps;
        const { params } = match;

        if (nextProps.toast !== this.props.toast) {
            this.toaster.show({ message: nextProps.toast, intent: 'success' });
        }

        if (!nextProps.event) {
            GAEvent({
                category: 'Event Landing Page',
                action: `Page Load | No Event`,
                label: `Can't find event ${params.event}`
            });
        }

        return true;
    }

    handleGAClick = (label, actionType) => {
        GAEvent({
            category: 'Event Landing Page',
            action: `Click | ${actionType}`,
            label
        });
    }

    handleModalTemplate = () => {
        const { editDialog, removeDialog } = this.state;
        const { event } = this.props;

        if (editDialog) {
            return (
                <Suspense fallback={<div>Something went wrong...</div>}>
                    <AnnouncementForm data={event} isEdit saveBtnClicked={() => this.handleModalClose('Announcement Edited')} />
                </Suspense>
            );
        } else if (removeDialog) {
            return (
                <Suspense fallback={<div>Something went wrong...</div>}>
                    <RemoveRequest action={this.handleRemoveRequest} reasonLabel="Reason for Removal" onClose={this.handleModalClose} />
                </Suspense>
            )
        }

        return (
            <Suspense fallback={<div>Something went wrong...</div>}>
                <div>Error...</div>
            </Suspense>
        );
    }

    handleRemoveRequest = (formData) => {
        const { event, remove } = this.props;
        const newEvent = {...event};

        newEvent.remove = {
            name: `${formData.firstName} ${formData.lastName}`,
            date: moment().format(dateFormats.utc),
            reason: formData.reason
        };

        newEvent.moderate = true;

        this.handleGAClick('Remove Event Requested', 'Remove Event');
        remove(newEvent);
        this.setState({modalOpen: false});
    }

    onEdit = () => {
        this.setState({modalOpen: true, dialogTitle: "Edit Announcement", editDialog: true});
    }

    onRemoval = () => {
        this.setState({modalOpen: true, dialogTitle: "Remove Announcement Request", removeDialog: true});
    }

    handleModalClose = (label) => {
        const { editDialog, removeDialog } = this.state;
        const closeMsg = typeof label === 'string' ? label : null;
        let type;

        if (editDialog) type = 'edit';
        else if (removeDialog) type = 'remove';

        this.handleGAClick("Announcement Edited" || `close ${type} dialog`, label || `${type} dialog closed`);
        this.setState({ modalOpen: false });
    }

    render() {
        const { modalOpen, dialogTitle } = this.state;
        const { event } = this.props;

        return (
            <div className="single-event-wrapper">
                {event && (
                    <Fragment>
                        <div className="row">
                            <div className="col-xs-12 first-sm col-sm-5 announcement-data">
                                <h2 className="title">{event?.title}</h2>
                                <div className="sub-title">
                                    ends on
                                    <span className="end-date">{moment(event?.date || event?.endDate, dateFormats.utc).format(dateFormats.longDate)}</span>
                                </div>
                                <div className="button-group">
                                    <Button text="Edit" onClick={this.onEdit} />
                                    <Button intent="danger" text="Remove" onClick={this.onRemoval}/>
                                </div>
                            </div>
                            <div className="col-xs-12 first-xs col-sm-7 announcement">
                                <Suspense fallback={<div>Can't find announcement</div>}>
                                    <MonthHeader month={event?.month} />
                                    <AnnouncementItem data={event} />
                                </Suspense>
                            </div>
                        </div>
                        <h3 className="info-heading">Information</h3>
                        <div className="row info-content">
                            <div className="col-xs-12 col-sm-6">
                                <h4>Created</h4>
                                <div>by: <span>{event?.created?.name || `${event?.firstName} ${event?.lastName}`}</span></div>
                                <div>on: <span>{event?.createdDate || moment(event?.created?.date, dateFormats.utc).format(dateFormats.dateTime)}</span></div>
                                <h4>Approved</h4>
                                <div>by: <span>{event?.approved?.name}</span></div>
                                <div>on: <span>{moment(event?.approved?.date, dateFormats.utc).format(dateFormats.dateTime)}</span></div>
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                {event?.edited && (
                                    event.edited.map((item, index) => (
                                        <div key={shortId.generate()}>
                                            <h4>Edited</h4>
                                            <div>by: {item?.name}</div>
                                            <div>on: {moment(item?.date, dateFormats.utc).format(dateFormats.dateTime)}</div>
                                            {!item.approvedBy && <div>status: waiting for approval</div>}
                                            {item?.approvedBy && (
                                                <Fragment>
                                                    <div>approved by: {item?.approvedBy}</div>
                                                    <div>approved on: {moment(item?.approvedOn, dateFormats.utc).format(dateFormats.dateTime)}</div>
                                                </Fragment>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <Dialog
                            title={dialogTitle}
                            isOpen={modalOpen}
                            onClose={this.handleModalClose}
                            autoFocus
                            canEscapeKeyClose
                            canOutsideClickClose
                            className="announcement-modal col-xs-12 col-sm-12 col-md-8"
                        >
                            {this.handleModalTemplate()}
                        </Dialog>
                        <Toaster position="top" ref={this.refHandlers.toaster} />
                    </Fragment>
                )}
                {!event && (
                    <div className="row">
                        <div className="center no-announcement col-xs-12">
                            <h3>This Announcement or Event does not exist.</h3>
                            <Link to="/announcements">Go Back</Link>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    event: getEvent(state),
    toast: toastEvent(state)
});

const mapDispatchToProps = {
    callEvent: callSingleEvent,
    remove: removeEvent
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleEvent);
