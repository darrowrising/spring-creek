// utils
import { store, docs } from '../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

export async function getMembers(set) {
    unsubscribe = store.collection('members').onSnapshot((snap) => {
        const members = (docs(snap) || []).map((item) => ({
            ...item,
            displayName: `${item?.preferName || item.firstName} ${item.lastName}`,
            callingsDisplay: (item?.callings || []).join(', '),
        }));
        set({ members, loading: false });
    });
}
