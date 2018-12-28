/* eslint-disable */
import fireDB from './fireDB';

export default function firebaseDispatchMiddleware(client) {
    return ({ getState, dispatch }) => next => (action) => {
        const {
            firebase,
            loadActionType,
            successActionType,
            failureActionType,
            ...asyncDescriptorParams
        } = action;

        if (!firebase) {
            return next(action);
        }

        function createAction(actionType, actionParams) {
            // If receiving an action creator rather than an action type,
            // return the result of calling that action creator
            if (typeof actionType === 'function') {
                return actionType(getState, actionParams);
            }

            // create an action object using the type and action params
            return {
                ...actionParams,
                type: actionType
            };
        }

        function dispatchErrorAction(error = {}) {

            if (failureActionType) {
                dispatch(createAction(failureActionType, {
                    ...asyncDescriptorParams,
                    error
                }));
            }
            // throw new Error(error);
        }

        function dispatchSuccessAction(result) {
            if (successActionType) {
                dispatch(createAction(successActionType, {
                    ...asyncDescriptorParams,
                    result
                }));
            }
        }

        // Dispatch the load action immediately
        // XXX The LOAD action is dispatched before the async behavior is triggered
        // i.e. before the promise is created
        if (loadActionType) {
            dispatch(createAction(loadActionType, asyncDescriptorParams));
        }

        if (firebase) {
            const type = firebase?.type;
            const docId = firebase?.docId;
            const ref = fireDB.ref(docId);

            switch (type) {
                case 'push':
                    return ref.push(firebase?.data, () => {
                        dispatchSuccessAction('success');
                    });
                default:
                    return fireDB.ref(firebase).once('value', (snap) => {
                        const val = snap.exists() ? snap.val() : 'No Data';

                        dispatchSuccessAction(val);
                    }, error => dispatchErrorAction(error));
            }

        }
    };
}
