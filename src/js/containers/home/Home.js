import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
// components
import SpecialAnnouncement from '../../components/special/Special';
import { GAEvent } from '../../components/analytics/Analytics';
// utils
import { meetingTimes, sundaySchoolTime, covidMaxCount, broadcastLink } from '../../../configs/unit.config';
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
        label,
    });
}

function Home() {
    const { time } = dateFormats;
    return (
        <div className="homepage-container page center container">
            <div className="content-width">
                {/* <div className="main-message bishopric-message">
                    <h2>Message From the Bishopric</h2>
                    <p>Brothers and Sisters,</p>
                    <p>
                        As we have brainstormed topics for our 5th Sunday lessons for January 31st, we have decided we
                        would like to have you submit questions and we will then structure the lesson around answering
                        these questions. We have done this with the youth on a couple of occasions and this has been
                        well received. We are excited to try this approach with the adults as well.
                    </p>
                    <p>Please use the respective links below to submit questions.</p>
                    <p>
                        <Link className="block sign-up" to="/question/adult" onClick={handleClick}>
                            Adult
                        </Link>
                        <Link className="block sign-up" to="/question/youth" onClick={handleClick}>
                            Youth
                        </Link>
                    </p>
                    <p>
                        <strong>- Spring Creek Bishopric</strong>
                    </p>
                </div> */}
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
                        <Link className="block sign-up" to="/sacrament-signup" onClick={handleClick}>
                            Sign Up
                        </Link>
                        <h4>Broadcast Information</h4>
                        <a href={broadcastLink} target="_blank" rel="noreferrer">
                            Meetinghouse Webcast
                        </a>
                        <ol className="schedule-list center" style={{ width: '80%' }}>
                            <li>
                                (Do Not use Firefox!) click &ldquo;
                                <a href={broadcastLink} target="_blank" rel="noreferrer">
                                    here
                                </a>
                                &rdquo; or link above.
                            </li>
                            <li>Click on &ldquo;Spring Creek Ward Sacrament Meetings&rdquo;</li>
                            <li>Please add your last name (this helps us get attendance)</li>
                        </ol>
                        <h3>Adult/Youth Second Hour Classes</h3>
                        <div>{`${moment(sundaySchoolTime, 'hh:mm').format(time)} (Zoom)`}</div>
                        <h3>Stake Website</h3>
                        <a href="https://farmingtonwest.org/" target="_blank" rel="noreferrer">
                            Farmington West Stake
                        </a>
                    </div>
                    <div id="map" className="col-xs-12 col-sm">
                        <h3>Map to New Building</h3>
                        <div className="address">79 S 1525 W</div>
                        <img
                            className="map"
                            src="https://firebasestorage.googleapis.com/v0/b/springcreeklds.appspot.com/o/NewChurchMap.jpg?alt=media&token=3d4d6add-cbf7-4f34-b472-af954d3a6fa4"
                            alt="new building map"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
