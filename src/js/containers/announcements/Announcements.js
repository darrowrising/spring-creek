/* TODO: Remove disabled */
/* eslint-disable  */
import React, { Component } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Dialog, Toast, Toaster, Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import shortId from 'shortid';
import { Link } from 'react-router-dom';

import AnnouncementForm from '../../components/forms/announcementForm/AnnouncementsForm';
import AnnouncementItem from '../../components/announcementItem/AnnouncementItem';
import { toastAnnoucement, getAnnoucements } from './announcementsEntities';
import { GAEvent } from '../../components/analytics/Analytics';
import { getAnnouncementList } from './announcementsActions';
import Calander from 'react-calendar';
import MonthHeader from '../../components/monthHeader/MonthHeader';

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
        const AddBtnText = "Add an Announcement or Event";
        // const currentMonth = moment().format(dateFormats.month);
        // const months = Object.keys(list);

        return (
            <div className="announcement-page page center container-fluid">
                <h1 className="page-header">Announcements and Events</h1>
                <div className="announcements row">
                    {/*}<div className="col-sm-4">
                        <Calander value={new Date()} tileClassName={({ date, view }) => view === 'month' && date.getDay() === 3 ? 'dude' : null} />
                    </div>*/}
                    <div className="col-xs-12 col-sm-8 center">
                        <div className="announcement-container add-event-wrapper" onClick={this.handleModalOpen}>
                            <Icon icon="plus" />
                            <div className="add-message">{AddBtnText}</div>
                        </div>
                        {
                            list.map(month => (
                                <div key={shortId.generate()}>
                                    <MonthHeader type={/eneral/.test(month.month) ? 'general' : 'month'} month={month.month} />
                                    {
                                        month.events.map(item => (
                                            <Link key={shortId.generate()} to={`announcements/${item.uid}`}>
                                                <AnnouncementItem
                                                    data={item}
                                                />
                                            </Link>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
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
