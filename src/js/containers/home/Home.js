import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
// components
import SpecialAnnouncement from '../../components/special/Special';
import { GAEvent } from '../../components/analytics/Analytics';
// utils
import { meetingTimes, sundaySchoolTime, sacramentSchedule, covidMaxCount } from '../../../configs/unit.config';
// configs
import dateFormats from '../../configs/dateFormats';
// styles
import './home.less';

function handleClick(event) {
    const { currentTarget } = event;
    const label = currentTarget.getAttribute('href').replace('/', '');

    GAEvent({
        category: 'User',
        action: 'Home Page Menu Clicked',
        label
    });
}

function Home() {
    const { time } = dateFormats;
    return (
        <div className="homepage-container page center container">
            <div className="content-width">
                <div className="main-message">
                    <h2>Welcome to the Spring Creek Ward website</h2>
                </div>
                <SpecialAnnouncement />
                <div className="link-blocks row">
                    <Link className="block program col-xs-12 col-sm" to="/program" onClick={handleClick}>
                        Sacrament Program
                    </Link>
                    <Link className="block announcements col-xs-12 col-sm" to="/announcements" onClick={handleClick}>
                        Announcements
                    </Link>
                </div>
                <div className="schedule-container row">
                    <div className="col-xs-12 col-sm">
                        <h3>Sacrament Meeting</h3>
                        <div>{moment(meetingTimes[0], 'hh:mm').format(time)}</div>
                        <h4>Sacrament Sign Up</h4>
                        <p className="sub-message">{`To help us keep to the Covid max count of ${covidMaxCount}`}</p>
                        <a href="https://calendly.com/springcreek/sacrament-meeting?month=2021-01" target="_blank" rel="noreferrer">Calendly Sign Ups</a>
                        <h4>Families to Attend In Person</h4>
                        <ul className="schedule-list center">
                            {sacramentSchedule.map(item => <li key={item}>{item}</li>)}
                        </ul>
                        <h3>Adult/Youth Second Hour Classes</h3>
                        <div>{`${moment(sundaySchoolTime, 'hh:mm').format(time)} (Zoom)`}</div>
                        <h3>Stake Website</h3>
                        <a href="https://farmingtonwest.org/" target="_blank" rel="noreferrer">Farmington West Stake</a>
                    </div>
                    <div id="map" className="col-xs-12 col-sm">
                        <h3>Map to New Building</h3>
                        <div className="address">79 S 1525 W</div>
                        <img className="map" src="https://firebasestorage.googleapis.com/v0/b/springcreeklds.appspot.com/o/NewChurchMap.jpg?alt=media&token=3d4d6add-cbf7-4f34-b472-af954d3a6fa4" alt="new building map" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
