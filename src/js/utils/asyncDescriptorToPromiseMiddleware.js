import fireDB from './fireDB';

export default function createGetPromiseFromAsyncDescriptorMiddleware(client) {
    return ({ getState, dispatch }) => next => (action) => {
        const {
            firebase,
            getPromise,
            loadActionType,
            successActionType,
            failureActionType,
            ...asyncDescriptorParams
        } = action;

        if (!getPromise) {
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
            throw new Error(error);
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
            console.log('asyncDescriptorParams:', asyncDescriptorParams);
            dispatch(createAction(loadActionType, asyncDescriptorParams));
        }

        if (firebase) {
            return fireDB.ref(firebase).once('value', (snap) => {
                const val = snap.val();

                if (val) {
                    dispatchSuccessAction(val);
                }
            }, error => dispatchErrorAction(error));
        }

        return new Promise((resolve, reject) => {
            getPromise(client)
                .then(
                    (response) => {
                        const responseDetails = {
                            ok: response.ok,
                            status: response.status,
                            url: response.url
                        };

                        return response.json()
                            .then((result) => {
                                if (response.status === 200) {
                                    dispatchSuccessAction(result);
                                } else {
                                    dispatchErrorAction(result);
                                }

                                return result;
                            })
                            .then(results => ({
                                ...responseDetails,
                                results
                            }))
                            .catch(error => dispatchErrorAction(error));
                    },
                    error => dispatchErrorAction(error)
                )
                .then(resolve, reject)
                .catch(error => dispatchErrorAction(error));
        });
    };
}
