/* TODO: Remove disabled */
/* eslint-disable  */
import React, { Component } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Button, Dialog, Toast, Toaster } from '@blueprintjs/core';
import { connect } from 'react-redux';
import shortId from 'shortid';

import AnnouncementForm from '../../components/forms/AnnouncementsForm';
import AnnouncementItem from '../../components/announcementItem/AnnouncementItem';
import { toastAnnoucement, getAnnoucements } from './announcementsEntities';
import { GAEvent } from '../../components/analytics/Analytics';
import { getAnnouncementList } from './announcementsActions';

import './announcements.less';

class Announcements extends Component {
    static propTypes = {
        list: arrayOf(
            shape()
        )
    };

    static defaultProps = {
        list: []
    }

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
        this.refHandlers = {
            toaster: (ref) => this.toaster = ref
        }
    }

    componentDidMount() {
        const { getList } = this.props;
        getList();
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
        const { toast, list } = this.props;
        const AddBtnText = "Add an Announcement";

        return (
            <div className="announcement-page page center container-fluid">
                <Button icon="add" intent="primary" text={AddBtnText} onClick={this.handleModalOpen} />
                <div className="announcements row around-sm">
                    {
                        list.map(item => (
                            <AnnouncementItem
                                key={shortId.generate()}
                                data={item}
                            />
                        ))
                    }
                </div>
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
    toast: toastAnnoucement(state),
    list: getAnnoucements(state)
});

const mapDispatchToProps = {
    getList: getAnnouncementList
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Announcements);
