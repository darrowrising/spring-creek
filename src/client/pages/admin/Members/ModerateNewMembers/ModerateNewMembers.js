import React from 'react';
import { shape } from 'prop-types';
import { Button } from 'antd';

// styles
// import {} from './ModerateNewMembers.styles';

function ModerateNewMembers({ member }) {
    return (
        <tr>
            <td>{`${member?.firstName} ${member?.lastName}`}</td>
            <td>{member?.email}</td>
            <td>
                <Button type="ghost">Welcome</Button>
                <Button>Deny</Button>
            </td>
        </tr>
    );
}

ModerateNewMembers.propTypes = {
    member: shape().isRequired,
};

// ModerateNewMembers.defaultProps = {
//
// };

export default ModerateNewMembers;
