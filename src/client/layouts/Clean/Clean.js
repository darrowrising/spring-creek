import React from 'react';
import { oneOfType, any } from 'prop-types';

import Header from '../../components/Header/Header';
import { Container, Page } from '../Main/Main.styles';

function Clean({ children }) {
  return (
    <Container>
      <Header />
      <Page>{children}</Page>
    </Container>
  );
}

Clean.propTypes = {
  children: oneOfType([any]).isRequired,
};

export default Clean;
