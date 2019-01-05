/* TODO: Remove disabled */
/* eslint-disable  */
import React, { Component } from 'react';
//import {} from 'prop-types';
import { Button, Dialog, Toast, Toaster } from '@blueprintjs/core';
import { connect } from 'react-redux';

import AnnouncementForm from '../../components/forms/AnnouncementsForm';
import { toastAnnoucement } from './announcementsEntities';
import { GAEvent } from '../../components/analytics/Analytics';

import './announcements.less';

class Announcements extends Component {
    //static propTypes = {
    //
    //};

    //static defaultProps = {
    //
    //}
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
        this.refHandlers = {
            toaster: (ref) => this.toaster = ref
        }
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.toast !== this.props.toast) {
            this.toaster.show({ message: nextProps.toast, intent: 'success' });
        }
        return true;
    }

    handleGAClick = (label) => {
        GAEvent({
            category: 'User',
            action: 'Click | Add Announcement',
            label
        });
    }

    handleModalOpen = () => {
        this.handleGAClick('Add an Announcement');
        this.setState({ modalOpen: true });
    }

    handleModalClose = (label) => {
        this.handleGAClick(label);
        this.setState({ modalOpen: false });
    }

    render() {
        const { modalOpen } = this.state;
        const { toast } = this.props;
        const AddBtnText = "Add an Announcement";

        return (
            <div className="announcement-container page center">
                <Button icon="add" intent="primary" text={AddBtnText} onClick={this.handleModalOpen} />
                <Dialog
                    title={AddBtnText}
                    isOpen={modalOpen}
                    onClose={() => this.handleModalClose('Create Announcement Form Closed')}
                    autoFocus
                    canEscapeKeyClose
                    canOutsideClickClose
                    className="announcement-modal col-xs-12 col-sm-12 col-md-8"
                >
                    <AnnouncementForm saveBtnClicked={() => this.handleModalClose('Announcement Created')} />
                </Dialog>
                <Toaster position="top" ref={this.refHandlers.toaster} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    toast: toastAnnoucement(state)
});

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Announcements);
