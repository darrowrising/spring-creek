import styled from 'styled-components';
import { arrayOf, shape } from 'prop-types';

import Button from '../../../components/Button';
import { SubHeading } from '../../../components/Heading';
import { dateTime } from '../../../configs/dateFormats';
import { db } from '../../../utils/firebase.utils';
import { utc } from '../../../utils/date.utils';

const ModerateContainer = styled.div`
  background-color: var(--color-white-1);
  border: 1px solid var(--color-grey-3);
  border-radius: 10px;
  margin-bottom: 40px;
  padding: 10px;
  width: 100%;
`;

const StyledSubHeading = styled(SubHeading)`
  padding: var(--space-2) 0 var(--space-4);
  border-bottom: 1px solid var(--color-grey-3);
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  th {
    background-color: var(--color-grey-3);
  }

  td,
  th {
    width: max-content;
    border: 1px solid var(--color-border-1);
    padding: var(--space-1) var(--space-4);
  }

  td:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const denyRequest = (data) => {
  const { uid } = data;

  db.collection('members').doc(uid).update({
    status: 'deactivated',
  });
};

const activateNewMember = (data) => {
  const { uid } = data;

  db.collection('members').doc(uid).update({
    status: 'active',
  });
};

function ModerateNewMembers({ newMembers = [] }) {
  return (
    <div>
      {newMembers.length !== 0 ? (
        <ModerateContainer>
          <StyledSubHeading>New Members Requesting Access</StyledSubHeading>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Signed Up</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {newMembers.map((member) => (
                <tr key={member.uid}>
                  <td>{`${member?.firstName} ${member?.lastName}`}</td>
                  <td>{member?.email}</td>
                  <td>{utc({ date: member.createdOn, format: dateTime })}</td>
                  <td style={{ width: '100%', float: 'right' }}>
                    <Button onClick={() => activateNewMember(member)}>Welcome</Button>
                    <Button color="red" ghost onClick={() => denyRequest(member)}>
                      Deny
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ModerateContainer>
      ) : null}
    </div>
  );
}

ModerateNewMembers.propTypes = {
  newMembers: arrayOf(shape()),
};

export default ModerateNewMembers;
