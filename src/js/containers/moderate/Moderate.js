/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
//import {} from 'prop-types';
import { connect } from 'react-redux';
import shortId from 'shortid';
import { Dialog } from '@blueprintjs/core';
import moment from 'moment';

import { getModerateList, deleteAnnouncement, approveAnnouncement, editAnnouncement, cancelRemovalRequest } from './moderateActions';
import { getModerateEntities } from './moderateEntities';
import AnnouncementItem from '../../components/announcementItem/AnnouncementItem';
import AnnouncementForm from '../../components/forms/announcementForm/AnnouncementsForm';
import EventApproval from '../../components/forms/simpleRequest/SimpleRequest';
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

            return <AnnouncementForm data={eventData} isEdit saveBtnClicked={() => this.handleModalClose('Announcement Edited')} />
        } else if (state.approvedDialog) {
            return <EventApproval action={this.handleApprovalFinal} onClose={this.handleModalClose} />
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

    handleApprovalFinal = (approver) => {
        const { approveEvent } = this.props;
        const { event } = this.state;
        let data = { ...event };
        const name = `${approver?.firstName} ${approver?.lastName}`;
        const date = moment().format(dateFormats.utc);

        // Only set approved the first time not when edited
        if (!data?.approved) {
            data.approved = {
                name,
                date,
            };
        }

        data.moderate = false;

        if (data?.edited) {
            // Adding more editor information
            const arr = data?.edited;
            const version = arr.pop();
            const index = arr.length;

            version.approvedBy = name;
            version.approvedOn = date;

            data.edited[index] = version;
            // End of adding more editor information
        }

        this.handleGAClick('Final approval button', 'Final Moderate Approval Button');
        approveEvent(data);

        this.setState({approvedDialog: false, modalOpen: false});
    }

    handleAnnouncementEdit = (event) => {
        this.setState({editDialog: true, dataId: event.id, modalOpen: true});
    }

    handleModalClose = (label) => {
        const { editDialog, deleteDialog, approvalDialog } = this.state;
        const closeMsg = typeof label === 'string' ? label : null;
        let type;

        if (editDialog) type = 'edit';
        else if (deleteEvent) type = 'delete';
        else if (approvalDialog) type = 'approve';

        this.handleGAClick(closeMsg || `close ${type} dialog`, label || `${type} dialog closed`);
        this.setState({ modalOpen: false });
    }

    handleCancelationOfRemovalRequest = (event) => {
        const { cancelRemoval } = this.props;
        const newEvent = {...event};
        this.handleGAClick('Cancelation of Removal Request', 'Cancel Removal');

        newEvent.remove = null;
        newEvent.moderate = false;

        cancelRemoval(newEvent);
    }

    render() {
        const { moderate } = this.props;
        const { data } = moderate;
        const { dialogText, modalOpen, editDialog, approvalDialog } = this.state;

        return (
            <div className="moderate-container page container-fluid">
                <h1 className="page-header">Moderation Page</h1>
                {
                    data.map(item => {
                        const isEdit = item?.editVersion && !item?.remove;
                        const isRemoval = item?.remove;
                        const typeTitle = () => {
                            if (isRemoval) return 'Remove';
                            if (isEdit) return 'Edited';
                            return 'New';
                        };
                        const event = item.editVersion || item;

                        return (
                            <div key={shortId.generate()} className={`${typeTitle().toLowerCase()}-wrapper`}>
                                <h2 className="type-title">{`${typeTitle()} Announcement Request`}</h2>
                                {isEdit && (
                                    <div className="row edit-title">
                                        <div className="col-xs-12 col-sm-6">Edited Version</div>
                                        <div className="col-xs-12 col-sm-6">Original Version</div>
                                    </div>
                                )}
                                <div className="row event-wrapper">
                                    <AnnouncementItem
                                        className={isEdit ? 'col-xs-12 col-sm-6' : 'col-xs-12 col-sm-8'}
                                        data={event}
                                        onDelete={this.handleAnnouncementDelete}
                                        onEdit={this.handleAnnouncementEdit}
                                        onApproval={this.handleAnnouncementApproval}
                                        onCancel={this.handleCancelationOfRemovalRequest}
                                        isEdit
                                    />
                                    {(item.editVersion && !item?.remove) && (
                                        <AnnouncementItem
                                            className="col-xs-6 old-version"
                                            data={item}
                                        />
                                    )}
                                </div>
                            </div>
                        )
                    })
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
    approveEvent: approveAnnouncement,
    cancelRemoval: cancelRemovalRequest
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Moderate);
