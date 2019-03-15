/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
//import {} from 'prop-types';

import { getAssignments } from './special_entity';
import { callAssignment } from './special_action';
import AnnouncementItem from '../announcementItem/AnnouncementItem';
import MonthHeader from '../monthHeader/MonthHeader';
import messaging from '../../configs/messaging';

import './special.less';

class Special extends Component {
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
        const { call } = this.props;
        call();
    }

    render() {
        const { assignment } = this.props;

        return (
            <div className="special-wrapper">
                {
                    assignment && (
                        <div className="special">
                            <MonthHeader title={messaging.announcements.special} />
                            <AnnouncementItem data={assignment} />
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    assignment: getAssignments(state)
});

const mapDispatchToProps = {
    call: callAssignment
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Special);
