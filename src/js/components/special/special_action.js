import ActionTypes from '../../configs/constants';

export function callAssignment() {
    return {
        loadActionType: ActionTypes.GET_BUILDING_CLEANING_REQUEST,
        successActionType: ActionTypes.GET_BUILDING_CLEANING_SUCCESS,
        failureActionType: ActionTypes.GET_BUILDING_CLEANING_FAILURE,
        firebase: {
            docId: '/announcements',
            type: 'query',
            key: 'title',
            equalTo: 'Building Cleaning Assignment'
        }
    };
}
