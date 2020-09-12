import React from 'react';
import ReactLoader from 'react-loading';
import { theme } from 'theme';

// styles
import { Container } from './Loading.styles';

function Loading() {
    return (
        <Container>
            <ReactLoader type="bars" color={theme('color_blue_3')} />
        </Container>
    );
}

export default Loading;
