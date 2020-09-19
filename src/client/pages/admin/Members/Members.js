import React from 'react';
// import {} from 'prop-types';
import { Button } from 'antd';

import Layout from '../../../layouts/Main/Main';
// styles
import { Container } from './Members.styles';

function Members() {
    return (
        <Layout>
            <Container>
                <Button>Add Member</Button>
            </Container>
        </Layout>
    );
}

// Members.propTypes = {

// };

// Members.defaultProps = {

// };

export default Members;
