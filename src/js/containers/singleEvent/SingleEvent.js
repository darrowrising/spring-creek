/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
//import {} from 'prop-types';
import { connect } from 'react-redux';
import shortId from 'shortid';

// components
import AnnouncementItem from '../../components/announcementItem/AnnouncementItem';
import MonthHeader from '../../components/monthHeader/MonthHeader';
// utilites
import { callSingleEvent } from './singleEvent.actions';
import { getEvent } from './singleEvent.entities';
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
    }

    componentDidMount() {
        const { callEvent, match } = this.props;
        const { params } = match;
        callEvent(params?.event);
    }

    render() {
        const { event } = this.props;

        return (
            <div className="single-event-wrapper">
                <div className="row">
                    <div className="col-xs-12 first-sm col-sm-4 announcement-data">
                        <h3>Created by:</h3>
                        <div>{event?.created?.name || `${event?.firstName} ${event?.lastName}`}</div>
                        <h3>Created on:</h3>
                        <div>{event?.created?.date || event?.createdDate}</div>
                        <h3>Approved by:</h3>
                        <div>{event?.approved?.name}</div>
                        <h3>Approved on:</h3>
                        <div>{event?.approved?.date}</div>
                        {event?.edited && (
                            event.edited.map(item => (
                                <div key={shortId.generate()}>
                                    <h3>Edited by:</h3>
                                    <div>{item?.name}</div>
                                    <h3>Edited on:</h3>
                                    <div>{item?.date}</div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="col-xs-12 first-xs col-sm-8 announcement">
                        <MonthHeader month={event?.month} />
                        <AnnouncementItem data={event} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    event: getEvent(state)
});

const mapDispatchToProps = {
    callEvent: callSingleEvent
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleEvent);
