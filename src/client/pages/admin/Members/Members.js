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
import { getMembers } from './Members.utils';
import { handleState } from '../../../utils/state.utils';
// styles
import { ModerateContainer } from './Members.styles';

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
                console.info('combine');
                // return resendInviteConfirm(record);
                return;
            case 'deactivate':
                console.info('deactivate');
                // return resetPasswordConfirm(record);
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
                    {newMembers.map((member) => (
                        <ModerateNewMembers member={member} />
                    ))}
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
