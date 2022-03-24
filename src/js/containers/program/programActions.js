import ActionTypes from '../../configs/constants';
import { fbDocId } from '../../utils/date';

export function getProgramData() {
  return {
    loadActionType: ActionTypes.GET_PROGRAM_REQUEST,
    successActionType: ActionTypes.GET_PROGRAM_SUCCESS,
    failureActionType: ActionTypes.GET_PROGRAM_FAILURE,
    firebase: `/program/${fbDocId}`,
  };
}
