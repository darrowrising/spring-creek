import React from 'react';
import { shape } from 'prop-types';
import { Button } from 'antd';
// utils
import { utc } from '../../../../utils/date.utils';
import { denyRequest, activateNewMember } from './ModerateNewMembers.utils';
// configs
import { dateTime } from '../../../../../configs/dateFormats.configs';
// styles
// import {} from './ModerateNewMembers.styles';

function ModerateNewMembers({ member }) {
  return (
    <tr>
      <td>{`${member?.firstName} ${member?.lastName}`}</td>
      <td>{member?.email}</td>
      <td>{utc(member.createdOn, dateTime)}</td>
      <td style={{ float: 'right' }}>
        <Button onClick={() => activateNewMember(member)}>Welcome</Button>
        <Button danger ghost onClick={() => denyRequest(member)}>
          Deny
        </Button>
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
