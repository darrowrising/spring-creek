import ActionTypes from '../../configs/constants';

export function callAssignment() {
    return {
        loadActionType: ActionTypes.GET_SPECIAL_ANNOUNCEMENT_REQUEST,
        successActionType: ActionTypes.GET_SPECIAL_ANNOUNCEMENT_SUCCESS,
        failureActionType: ActionTypes.GET_SPECIAL_ANNOUNCEMENT_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'query',
            queries: [
                {
                    key: 'title',
                    equalTo: 'Building Cleaning Assignment',
                },
            ],
        },
    };
}
