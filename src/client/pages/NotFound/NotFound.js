import React from 'react';

// layouts
import Layout from '../../layouts/Main/Main';
// styles
import { Wrapper, Message } from './NotFound.styles';

function NotFound() {
    return (
        <Layout>
            <Wrapper>
                <Message>404 Error - Page not found!</Message>
            </Wrapper>
        </Layout>
    );
}

export default NotFound;
