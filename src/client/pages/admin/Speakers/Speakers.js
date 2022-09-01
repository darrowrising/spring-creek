import React from 'react';

// components
import Layout from '../../../layouts/Main/Main';
import PageHeader from '../../../components/PageHeader/PageHeader';
import SpeakerTable from './Table/Table';
import UpToSpeak from './UpToSpeak';
// styles
// import { TableWrapper } from './Speakers.styles';

function Speakers() {
  return (
    <Layout>
      <PageHeader>Sacrament Speakers</PageHeader>
      <UpToSpeak />
      <SpeakerTable />
    </Layout>
  );
}

export default Speakers;
