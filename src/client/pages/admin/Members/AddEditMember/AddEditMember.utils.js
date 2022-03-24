import shortId from 'shortid';
import { notification } from 'antd';
// utils
import { utc } from '../../../../utils/date.utils';
import { store as db } from '../../../../utils/firebase.utils';

/* eslint-disable */
export async function saveMember(record, set, setParent) {
    const uid = record?.uid || shortId.generate();
    const ref = db.collection('members').doc(uid);
    const isEdit = record?.uid;
    let obj = {};
    let message = '';

    Object.keys(record).forEach((item) => {
        const value = record[item];

        if (value) obj[item] = value;
    });

    try {
        if (isEdit) {
            delete obj.callingsDisplay;
            delete obj.displayName;
            delete obj.memberState;
            delete obj.onClick;

            await ref.update(obj);
            message = 'Member Updated';
        } else {
            await ref.set({
                ...obj,
                uid,
                createdOn: utc(),
                status: 'inactive',
                lastSpokeInSacrament: '',
                lastPrayedInSacrament: '',
            });
            message = 'Member Created';
        }

        notification.success({
            message,
        });

        setParent({ showModal: false, modalContent: {} });
    } catch (err) {
        console.error(err);
    }
}
