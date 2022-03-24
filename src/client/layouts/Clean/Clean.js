import React from 'react';
import { oneOfType, any } from 'prop-types';

// components
import Header from '../../components/Header/Header';

// utils
// import { getStorage, removeStorage } from '../../utils/localStorage.utils';
// styles
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
