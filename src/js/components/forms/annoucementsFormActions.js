import ActionTypes from '../../configs/constants';
import db from '../../utils/fireDB';

export async function setAnnoucementData(data) {
    const newData = { ...data };
    let incNumber = null;
    const ref = db.ref('/announcements/inc');

    await ref.once('value', (snap) => {
        incNumber = snap.val();
        ref.set(incNumber + 1);
    });

    newData.uid = `a${incNumber}`;

    return {
        loadActionType: ActionTypes.SET_ANNOUCEMENT_REQUEST,
        successActionType: ActionTypes.SET_ANNOUCEMENT_SUCCESS,
        failureActionType: ActionTypes.SET_ANNOUCEMENT_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'push',
            data: newData
        }
    };
}

export function editAnnouncementData(data) {
    return {
        loadActionType: ActionTypes.EDIT_ANNOUNCEMENT_REQUEST,
        successActionType: ActionTypes.EDIT_ANNOUNCEMENT_SUCCESS,
        failureActionType: ActionTypes.EDIT_ANNOUNCEMENT_FAILURE,
        firebase: {
            docId: `/announcements/${data.id}`,
            type: 'update',
            data
        }
    };
}

export function getIncNumber() {
    return {
        loadActionType: ActionTypes.GET_INC_NUMBER_REQUEST,
        successActionType: ActionTypes.GET_INC_NUMBER_SUCCESS,
        failureActionType: ActionTypes.GET_INC_NUMBER_FAILURE,
        firebase: {
            docId: '/announcements/inc',
            type: 'get'
        }
    };
}
