import { useMemo } from 'react';
import styled from 'styled-components';
import { func, string } from 'prop-types';
import { Badge, notification } from 'antd';

import Button, { ButtonGroup } from '../../../components/Button';
import BackupProvider, { useBackups } from './provider';
import { dateShort } from '../../../configs/dateFormats';
import { utc } from '../../../utils/date.utils';
import { backup, remove, restore } from './scripts/utils';

import { removeSpokeLast } from './scripts/removeSpokeLast';
// import { addYear } from './scripts/addYear';
import { addMemberUid } from './scripts/addMemberUid';
import { transferEvents } from './scripts/moveEvents';
import { makeProgram } from './scripts/makeProgram';
import { addUidToSpeaker } from './scripts/addUidToSpeaker';

const { Ribbon } = Badge;

const Grid = styled.div`
  display: flex;
  gap: var(--space-8);
  flex-direction: column;

  .ant-ribbon-wrapper {
    width: 100%;
  }
`;

const Item = styled.div`
  background-color: var(--color-white-1);
  border: 1px solid var(--color-border-1);
  border-radius: var(--space-4);
  padding: var(--space-4);
  width: 100%;

  & > h4 {
    padding-bottom: var(--space-2);
  }

  & > ${ButtonGroup} {
    float: right;
  }
`;

function Task({ label, collection, action }) {
  const { backups } = useBackups();
  const [api, contextHolder] = notification.useNotification();
  const currentBackup = useMemo(() => backups.find(({ name }) => name === collection), [backups]);
  const text = currentBackup ? `last backup on ${utc({ date: currentBackup.date, format: dateShort })}` : '';

  const handleRunAction = async () => {
    await action();
    api.success({
      message: 'Migration Complete',
    });
  };

  return (
    <Ribbon text={text} color={currentBackup ? 'orange' : 'white'}>
      {contextHolder}
      <Item>
        <h4>{label}</h4>

        <Button onClick={handleRunAction} color="primary">
          Run
        </Button>
        <ButtonGroup>
          <Button color="orange" onClick={() => backup(collection)}>
            Backup
          </Button>
          <Button color="green" onClick={() => restore(collection, currentBackup)}>
            Restore
          </Button>
          <Button color="red" onClick={() => remove(collection)}>
            Remove
          </Button>
        </ButtonGroup>
      </Item>
    </Ribbon>
  );
}

Task.propTypes = {
  action: func,
  label: string,
  collection: string,
};

const MIGRATIONS = [
  {
    label: 'Remove Last Spoke In Sacrament',
    action: removeSpokeLast,
    collection: 'members',
  },
  // {
  //   label: 'Add Year to Members',
  //   action: addYear,
  //   collection: 'members',
  // },
  {
    label: 'Add Member Uid to Program Speakers',
    action: addMemberUid,
    collection: 'program',
  },
  {
    label: 'Add UID to program speakers',
    action: addUidToSpeaker,
    collection: 'program',
  },
  {
    label: 'Transfer Events',
    action: transferEvents,
    collection: 'announcements',
  },
  {
    label: 'Create Program',
    action: makeProgram,
    collection: '',
  },
];

function Migrations() {
  return (
    <BackupProvider>
      <Grid>
        {MIGRATIONS.map(({ label, ...configs }) => (
          <Task key={label} label={label} {...configs} />
        ))}
      </Grid>
    </BackupProvider>
  );
}

export default Migrations;
