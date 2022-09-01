import { store, docs } from '../../../../utils/firebase.utils';
import { utc } from '../../../../utils/date.utils';

export let unsubscribe = null; // eslint-disable-line

let membersList = null;
const membersRef = store.collection('members');

const createDisplayName = (member) => `${member?.preferredName || member.firstName} ${member.lastName}`;

export const fetchWhoSpokeLast = async (set, ageGroup = 'adult') => {
  try {
    unsubscribe = membersRef
      .where('ageGroup', '==', ageGroup)
      .where('delayInSpeaking', '<=', utc())
      .orderBy('delayInSpeaking')
      .orderBy('lastSpokeInSacrament')
      .limit(20)
      .onSnapshot((snap) => {
        const members = (docs(snap) ?? []).map((member) => ({
          ...member,
          displayName: createDisplayName(member),
        }));

        set({ speakers: members, isLoading: false });
      });
  } catch (error) {
    console.error('Unable to get members who last spoke', error);
    set({ isError: true });
  }
};

const isSearch = (toSearch, searchValue) => toSearch.toLowerCase().includes(searchValue.toLowerCase());

export const fetchMembers = async (set, searchValue) => {
  set({ isLoading: true });

  if (!membersList) {
    const membersSnap = await membersRef.get();
    membersList = docs(membersSnap);
  }
  if (searchValue) {
    const members = membersList
      .filter(
        ({ preferredName = '', firstName, lastName }) =>
          isSearch(preferredName, searchValue) || isSearch(firstName, searchValue) || isSearch(lastName, searchValue)
      )
      .map((member) => ({
        ...member,
        displayName: createDisplayName(member),
      }));

    set({ speakers: members, isSearch: true, isLoading: false });
  } else {
    set({ isLoading: false });
  }
};

export const saveNote = (docId, value = '') => {
  store.collection('members').doc(docId).update({ speakingNote: value });
};
