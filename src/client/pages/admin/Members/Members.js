import React, { useEffect, useState, useContext } from 'react';
import { Modal } from 'antd';
// providers
import { NotificationsContext } from '../../../providers/Notifications.provider';
// components
import Layout from '../../../layouts/Main/Main';
import MembersList from './MembersList/MembersList';
import EditMember from './AddEditMember/AddEditMember';
import PageHeader from '../../../components/PageHeader/PageHeader';
import ModerateNewMembers from './ModerateNewMembers/ModerateNewMembers';
// utils
import { getMembers, deactivateMember, combineMembers } from './Members.utils';
import { handleState } from '../../../utils/state.utils';
// styles
import { ModerateContainer, ModerateTable, Heading } from './Members.styles';

const initialState = {
  loading: true,
  members: [],
  showModal: false,
  modalContent: {},
  modalTemplate: '',
};

function Members() {
  // hooks
  const [state, setState] = useState(initialState);
  const { newMembers } = useContext(NotificationsContext);
  // data
  const { members, loading, showModal, modalContent, modalTemplate } = state;
  const ModalContentComp = modalTemplate;
  // handlers
  const set = (update) => handleState(update, setState);
  const handleOnClick = (record, type) => {
    switch (type) {
      case 'edit': {
        return set({
          showModal: true,
          modalContent: record,
          modalTemplate: EditMember,
        });
      }
      case 'combine':
        combineMembers(record);
        // return resendInviteConfirm(record);
        return;
      case 'deactivate':
        deactivateMember(record);
        return;
      default:
        return null;
    }
  };

  useEffect(() => {
    getMembers(set);
  }, []);
  /* eslint-disable indent, react/jsx-indent */
  return (
    <Layout>
      <PageHeader>Members</PageHeader>
      {newMembers.length !== 0 ? (
        <ModerateContainer>
          <Heading>New Members Requesting Access</Heading>
          <ModerateTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Signed Up</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {newMembers.map((member) => (
                <ModerateNewMembers member={member} />
              ))}
            </tbody>
          </ModerateTable>
        </ModerateContainer>
      ) : null}
      <MembersList members={members} loading={loading} memberState={set} onClick={handleOnClick} />
      <Modal
        header={null}
        footer={null}
        visible={showModal}
        onCancel={() => set({ modalContent: {}, showModal: false })}
        destroyOnClose
      >
        <ModalContentComp content={modalContent} setParentState={set} />
      </Modal>
    </Layout>
  );
  /* eslint-enable indent, react/jsx-indent */
}

export default Members;
