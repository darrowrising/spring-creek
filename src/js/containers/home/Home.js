import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
// components
import SpecialAnnouncement from '../../components/special/Special';
import { GAEvent } from '../../components/analytics/Analytics';
// utils
import {
    meetingTimes,
    sundaySchoolTime,
    // covidMaxCount,
    broadcastLink,
} from '../../../configs/unit.config'; /* eslint-disable-line */
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
                <div className="main-message bishopric-message">
                    <h2>Youth Conference</h2>
                    <p>
                        We are excited for our upcoming Youth Conference for the Spring Creek ward. All youth who turn
                        14 in 2021 or are 14 and older are invited to join us. Please fill out the{' '}
                        <Link to="/signup/youth-conference">form</Link> to allow for planning for food and
                        transportation
                    </p>
                    <h4>Sunday, October 31st</h4>
                    <p>
                        Kickoff Fireside @ 4 p.m. in the Chapel (Sunday dress) Youth and leaders are invited.
                        Refreshments will be served
                    </p>
                    <h4>Wednesday, Nov 3rd</h4>
                    <p>Glow in the dark volleyball and dodgeball at 7 p.m. Gym</p>
                    <h4>Friday, Nov 5th</h4>
                    <p>
                        Overnight at{' '}
                        <a
                            href="https://camping.churchofjesuschrist.org/property/561215"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Snydermill Recreation Camp
                        </a>{' '}
                        (in Kimball Junction, near Park City)
                    </p>
                    <ul>
                        <li>Indoor sleeping areas (separate for young women and young men)</li>
                        <li>Food, outdoor and indoor games, service project and lots of fun</li>
                        <li>Meet at the church at 4 p.m. on Friday</li>
                        <li>Home by 4 p.m. on Saturday</li>
                    </ul>

                    <p>Questions? Please contact Bro or Sis Dangerfield</p>
                    <Link to="/signup/youth-conference">Youth Conference Signup</Link>
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
                        {/* <h4>Sacrament Sign Up</h4>
                        <p className="sub-message">{`To help us keep to the Covid max count of ${covidMaxCount}`}</p>
                        <Link className="block sign-up" to="/sacrament-signup" onClick={handleClick}>
                            Sign Up
                        </Link> */}
                        <h4>Broadcast Information</h4>
                        <div>Zoom link to the broadcast.</div>
                        <a href={broadcastLink} target="_blank" rel="noreferrer">
                            {broadcastLink}
                        </a>
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
