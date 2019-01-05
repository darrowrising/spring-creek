import ActionTypes from '../../configs/constants';

export function setAnnoucementData(data) {
    return {
        loadActionType: ActionTypes.SET_ANNOUCEMENT_REQUEST,
        successActionType: ActionTypes.SET_ANNOUCEMENT_SUCCESS,
        failureActionType: ActionTypes.SET_ANNOUCEMENT_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'push',
            data
        }
    };
}
