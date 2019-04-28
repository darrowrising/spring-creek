import ActionTypes from '../../configs/constants';

export function callSingleEvent(id) {
    return {
        loadActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_REQUEST,
        successActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_SUCCESS,
        failureActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'query',
            key: 'uid',
            equalTo: id
        }
    };
}
