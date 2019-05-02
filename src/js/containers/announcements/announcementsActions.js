import ActionTypes from '../../configs/constants';

export function getAnnouncementList() {
    return {
        loadActionType: ActionTypes.GET_ANNOUCEMENT_LIST_REQUEST,
        successActionType: ActionTypes.GET_ANNOUCEMENT_LIST_SUCCESS,
        failureActionType: ActionTypes.GET_ANNOUCEMENT_LIST_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'query',
            queries: [{
                key: 'moderate',
                equalTo: false
            }]
        }
    };
}
