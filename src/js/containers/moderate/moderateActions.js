import ActionTypes from '../../configs/constants';

export function getModerateList() {
  return {
    loadActionType: ActionTypes.GET_MODERATE_LIST_REQUEST,
    successActionType: ActionTypes.GET_MODERATE_LIST_SUCCESS,
    failureActionType: ActionTypes.GET_MODERATE_LIST_FAILURE,
    firebase: {
      docId: '/announcements',
      type: 'query',
      queries: [
        {
          key: 'moderate',
          equalTo: true,
        },
        {
          key: 'editVersion/moderate',
          equalTo: true,
        },
      ],
    },
  };
}

export function deleteAnnouncement(id) {
  return {
    loadActionType: ActionTypes.DELETE_ANNOUNCEMENT_REQUEST,
    successActionType: ActionTypes.DELETE_ANNOUNCEMENT_SUCCESS,
    failureActionType: ActionTypes.DELETE_ANNOUNCEMENT_FAILURE,
    firebase: {
      docId: `/announcements/${id}`,
      type: 'remove',
    },
  };
}

export function approveAnnouncement(data) {
  return {
    loadActionType: ActionTypes.APPROVE_ANNOUNCEMENT_REQUEST,
    successActionType: ActionTypes.APPROVE_ANNOUNCEMENT_SUCCESS,
    failureActionType: ActionTypes.APPROVE_ANNOUNCEMENT_FAILURE,
    firebase: {
      docId: `/announcements/${data.id}`,
      type: 'set',
      data,
    },
  };
}

export function cancelRemovalRequest(data) {
  return {
    loadActionType: ActionTypes.CANCEL_REMOVAL_REQUEST,
    successActionType: ActionTypes.CANCEL_REMOVAL_SUCCESS,
    failureActionType: ActionTypes.CANCEL_REMOVAL_FAILURE,
    firebase: {
      docId: `/announcements/${data.id}`,
      type: 'update',
      data,
    },
  };
}
