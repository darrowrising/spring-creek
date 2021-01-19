import React, { useEffect, useState } from 'react';
// import {} from 'prop-types';
import { Modal } from 'antd';
// components
import Layout from '../../../layouts/Main/Main';
import MembersList from './MembersList/MembersList';
import EditMember from './AddEditMember/AddEditMember';
// utils
import { getMembers } from './Members.utils';
import { handleState } from '../../../utils/state.utils';
// styles
import { Container } from './Members.styles';

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

    return (
        <Layout>
            <Container>
                <MembersList members={members} loading={loading} memberState={set} onClick={handleOnClick} />
            </Container>
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
}

// Members.propTypes = {

// };

// Members.defaultProps = {

// };

export default Members;
