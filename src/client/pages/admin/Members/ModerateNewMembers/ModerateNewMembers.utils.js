import { store as db } from '../../../../utils/firebase.utils';

export function denyRequest(data) {
    const { uid } = data;

    db.collection('members').doc(uid).update({
        status: 'deactivated',
    });
}

export function activateNewMember(data) {
    const { uid } = data;

    db.collection('members').doc(uid).update({
        status: 'active',
    });
}
