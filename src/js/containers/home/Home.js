/* TODO: Remove disabled */
/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
//import {} from 'prop-types';

import './home.less';

function Home(props) {
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
                    <Link className="block program" to="/program">
                        Sacrament Program
                    </Link>
                    <Link className="block announcements" to="/announcements">
                        Announcements
                    </Link>
                </div>
            </div>
        </div>
    );
}

//Home.propTypes = {

//};

//Home.defaultProps = {

//};

export default Home;
