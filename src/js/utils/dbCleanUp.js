import fireDB from './fireDB';

function addKeyToObjectValue(obj) {
    const keys = Object.keys(obj);

    return keys.map((key) => {
        const data = obj[key];
        data.id = key;

        return data;
    });
}

export function fbRef(options, successFunc, errorFunc) {
    const type = options?.type;
    const docId = options?.docId;
    const ref = fireDB.ref(docId);
    const child = options?.key;
    const data = options?.data;

    switch (type) {
        case 'push':
            return ref.push(options?.data, () => {
                successFunc('success');
            });
        case 'query': {
            const val = options?.equalTo;

            return ref.orderByChild(child).equalTo(val).once('value', (snap) => {
                const valObject = snap.val() || {};
                const successVal = addKeyToObjectValue(valObject);

                successFunc(successVal);
            });
        }
        case 'remove':
            return ref.remove().then(() => {
                const id = docId.split('/').pop();
                successFunc(id);
            })
                .catch((error) => {
                    errorFunc(error);
                });
        case 'update':
            return ref.update(data).then(() => {
                successFunc(data);
            })
                .catch((error) => {
                    errorFunc(error);
                });
        default:
            return fireDB.ref(options).once('value', (snap) => {
                const val = snap.exists() ? snap.val() : 'No Data';

                successFunc(val);
            }, error => errorFunc(error));
    }
}
