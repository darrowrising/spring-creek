import React from 'react';
// import {} from 'prop-types';

// components
import Layout from '../../../layouts/Main/Main';
import PageHeader from '../../../components/PageHeader/PageHeader';
import SpeakerTable from './Table/Table';
// styles
// import {} from './Speakers.styles';

function Speakers() {
    return (
        <Layout>
            <PageHeader>Sacrament Speakers</PageHeader>
            <SpeakerTable />
        </Layout>
    );
}

// Speakers.propTypes = {

// };

// Speakers.defaultProps = {

// };

export default Speakers;
