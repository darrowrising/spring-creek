// utils
import { store, docs } from '../../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

export async function getData(set) {
    // eslint-disable-line
    unsubscribe = store
        .collection('attendance')
        .where('reason', '==', 'overlimit')
        .onSnapshot((snap) => {
            const doc = docs(snap);

            set({
                loading: false,
                data: doc,
            });
        });
}
