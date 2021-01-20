// utils
import { store as db, docs } from '../../../utils/firebase.utils';
import { search } from '../../../utils/search.util';

const searchKeyAllowList = ['question', 'category'];

export const searchList = (list, value) => search(list, value, searchKeyAllowList);

export let unsubscribe = null; // eslint-disable-line

export function getQuestions(set) {
    unsubscribe = db.collection('questions').onSnapshot((snap) => {
        const values = docs(snap);
        set({ list: values, questions: values, loading: false });
    });
}
