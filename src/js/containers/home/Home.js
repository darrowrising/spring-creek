import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="homepage-container page center">
            <div className="content-width">
                <div className="main-message">
                    <h2>Welcome to the new Spring Creek Ward website.</h2>
                    <p>This will be a location for ward information and communication.
                        This is a work in progress so please keep coming back to learn more of the changes.
                    </p>
                </div>
                <div className="link-blocks">
                    <Link className="block program" to="/program" onClick={handleClick}>
                        Sacrament Program
                    </Link>
                    <Link className="block announcements" to="/announcements" onClick={handleClick}>
                        Announcements
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
