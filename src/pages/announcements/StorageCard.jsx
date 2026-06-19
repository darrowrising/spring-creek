import React from 'react';
import styled from 'styled-components';
import { FormOutlined } from '@ant-design/icons';
import { func, string } from 'prop-types';

import { utc } from '../../utils/date.utils';
import { getOrganizationColor } from '../../utils/organizations.utils';
import { dateShort } from '../../configs/dateFormats';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-1);
  cursor: pointer;
  font-size: 1.1em;
  padding: 0 0 var(--space-1);

  &:hover {
    color: var(--color-primary);
  }
`;

const StorageCardContainer = styled.div`
  background-color: var(--color-white-2);
  border: 1px solid var(--color-grey-3);
  border-radius: 6px;
  color: var(--color-black-2);
  overflow: hidden;
  opacity: 0.6;
`;

const Group = styled.h4`
  background-color: ${({ group }) => getOrganizationColor(group)};
  color: var(--color-white-1);
  font-size: 10px;
  padding: 5px;
  text-align: left;
  text-indent: 10px;
`;

const Title = styled.h3`
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: var(--space-2) var(--space-4);
  justify-content: space-between;
`;

const CreatedDate = styled.em`
  justify-self: flex-end;
  font-weight: 300;
  font-size: 0.6em;

  color: var(--color-grey-1);

  & > span {
    color: var(--color-primary);
    padding-right: var(--space-1);
  }
`;

function StorageCard({ title, createdOn, group, uid, onEdit }) {
  return (
    <CardWrapper>
      <EditRow>
        <EditButton type="button" aria-label="Edit announcement" onClick={() => onEdit(uid)}>
          <FormOutlined />
        </EditButton>
      </EditRow>
      <StorageCardContainer>
        <Group>{group}</Group>
        <Title>
          {title}
          <CreatedDate>
            {createdOn && (
              <>
                <span>created on</span> {utc({ date: createdOn, format: dateShort })}
              </>
            )}
          </CreatedDate>
        </Title>
      </StorageCardContainer>
    </CardWrapper>
  );
}

StorageCard.propTypes = {
  title: string.isRequired,
  createdOn: string.isRequired,
  group: string.isRequired,
  uid: string.isRequired,
  onEdit: func.isRequired,
};

export default StorageCard;
