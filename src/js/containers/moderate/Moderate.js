/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
//import {} from 'prop-types';
import { connect } from 'react-redux';
import shortId from 'shortid';
import { Dialog } from '@blueprintjs/core';
import moment from 'moment';

import { getModerateList, deleteAnnouncement, approveAnnouncement } from './moderateActions';
import { getModerateEntities } from './moderateEntities';
import AnnouncementItem from '../../components/announcementItem/AnnouncementItem';
import AnnouncementForm from '../../components/forms/AnnouncementsForm';
import EventApproval from '../../components/forms/EventApproval';
import { GAEvent } from '../../components/analytics/Analytics';
import dateFormats from '../../configs/dateFormats';

import './moderate.less';

class Moderate extends Component {
    //static propTypes = {
    //
    //};

    //static defaultProps = {
    //
    //}

    constructor(props) {
        super(props);
        this.state = {
            deleteDialog: false,
            editDialog: false,
            approvedDialog: false,
            modalOpen: false,
            dataId: '',
            dialogText: ''
        }
    }

    componentDidMount() {
        const { getList } = this.props;
        getList();
    }

    handleGAClick = (label, actionType) => {
        GAEvent({
            category: 'Moderate',
            action: `Click | ${actionType}`,
            label
        });
    }

    handleModalTemplate = () => {
        const state = {...this.state};
        const { data } = this.props.moderate;

        if (state.editDialog) {
            const eventData = data.find(item => item.id === state.dataId);

            return <AnnouncementForm data={eventData} saveBtnClicked={() => this.handleModalClose('Announcement Edited')} />
        } else if (state.approvedDialog) {
            return <EventApproval approved={this.handleApprovalFinal} onClose={this.handleModalClose} />
        }
    }

    handleAnnouncementDelete = (id) => {
        this.handleGAClick('1st delete button', '1st Moderate Delete Button');
        const confirm = window.confirm("Are you sure?");
        this.handleDeleteFinal(confirm, id);
    }

    handleDeleteFinal = (result, id) => {
        const { deleteEvent } = this.props;
        const type = result ? 'ok' : 'cancel';
        this.handleGAClick(`final delete button | ${type}`, `Final Moderate Delete Button | ${type}`);
        deleteEvent(id);
    }

    handleAnnouncementApproval = (event) => {
        this.handleGAClick('1st approval button', '1st Moderate Approval Button');
        this.setState({approvedDialog: true, modalOpen: true, dialogText: 'Approved By', event});
    }

    handleApprovalFinal = (firstName, lastName) => {
        const { approveEvent } = this.props;
        const { event } = this.state;
        const eventData = event;

        event.approved = {
            name: `${firstName} ${lastName}`,
            date: moment().format(dateFormats.dateTime)
        };
        event.moderate = false;

        this.handleGAClick('Final approval button', 'Final Moderate Approval Button');
        approveEvent(event);

        this.setState({approvedDialog: false, modalOpen: false});
    }

    handleAnnouncementEdit = (event) => {
        this.setState({editDialog: true, dataId: event.id, modalOpen: true});
    }

    handleModalClose = (action, label) => {
        const { editDialog, deleteDialog, approvalDialog } = this.state;
        let type;

        if (editDialog) type = 'edit';
        else if (deleteEvent) type = 'delete';
        else if (approvalDialog) type = 'approve';

        this.handleGAClick(action || `close ${type} dialog`, label || `${type} dialog closed`);
        this.setState({ modalOpen: false });
    }

    render() {
        const { moderate } = this.props;
        const { data } = moderate;
        const { dialogText, modalOpen, editDialog, approvalDialog } = this.state;

        return (
            <div className="moderate-container page container-fluid">
                <h1 className="page-header">Moderation Page</h1>
                {
                    data.map(item => (
                        <AnnouncementItem
                            key={shortId.generate()}
                            data={item}
                            onDelete={this.handleAnnouncementDelete}
                            onEdit={this.handleAnnouncementEdit}
                            onApproval={this.handleAnnouncementApproval}
                        />
                    ))
                }
                <Dialog
                    title={dialogText}
                    isOpen={modalOpen}
                    onClose={this.handleModalClose}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    className="announcement-modal col-xs-12 col-sm-12 col-md-8"
                >
                    {this.handleModalTemplate()}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    moderate: getModerateEntities(state)
});

const mapDispatchToProps = {
    getList: getModerateList,
    deleteEvent: deleteAnnouncement,
    approveEvent: approveAnnouncement
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Moderate);
