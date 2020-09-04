import React from 'react';
import { Link } from 'react-router-dom';

import SpecialAnnouncement from '../../components/special/Special';
import { GAEvent } from '../../components/analytics/Analytics';

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
    return (
        <div className="homepage-container page center container">
            <div className="content-width">
                <div className="main-message">
                    <h2>Welcome to the new Spring Creek Ward website</h2>
                    <p>
                        This will be a location to post and view ward information.
                        This is a work in progress so please keep checking the site.
                    </p>
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
            </div>
        </div>
    );
}

export default Home;
