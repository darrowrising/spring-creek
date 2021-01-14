import ActionTypes from '../../configs/constants';

export function callSingleEvent(id) {
    return {
        loadActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_REQUEST,
        successActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_SUCCESS,
        failureActionType: ActionTypes.GET_SINGLE_ANNOUNCEMENT_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'query',
            queries: [
                {
                    key: 'uid',
                    equalTo: id,
                },
            ],
        },
    };
}

export function removeEvent(data) {
    console.log('data:', data);
    return {
        loadActionType: ActionTypes.DELETE_ANNOUNCEMENT_REQUEST,
        successActionType: ActionTypes.DELETE_ANNOUNCEMENT_SUCCESS,
        failureActionType: ActionTypes.DELETE_ANNOUNCEMENT_FAILURE,
        firebase: {
            docId: `/announcements/${data.id}`,
            type: 'update',
            data,
        },
    };
}
