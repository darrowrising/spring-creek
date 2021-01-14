import React, { useEffect, useState } from 'react';
// import {} from 'prop-types';
import { Button } from 'antd';
// components
import Layout from '../../../layouts/Main/Main';
import MembersList from './MembersList/MembersList';
// utils
import { getMembers } from './Members.utils';
import { handleState } from '../../../utils/state.utils';
// styles
import { Container } from './Members.styles';

const initialState = {
    loading: true,
    members: [],
};

function Members() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { members, loading } = state;
    // handlers
    const set = (update) => handleState(update, setState);

    useEffect(() => {
        getMembers(set);
    }, []);

    return (
        <Layout>
            <Container>
                <Button>Add Member</Button>
                <MembersList members={members} loading={loading} memberState={set} />
            </Container>
        </Layout>
    );
}

// Members.propTypes = {

// };

// Members.defaultProps = {

// };

export default Members;
