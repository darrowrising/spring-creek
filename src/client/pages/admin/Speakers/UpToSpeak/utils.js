import { store, docs } from '../../../../utils/firebase.utils';

export let unsubscribe = null; // eslint-disable-line

export const fetchWhoSpokeLast = async (set, ageGroup = 'adult') => {
  try {
    unsubscribe = store
      .collection('members')
      .where('ageGroup', '==', ageGroup)
      .orderBy('lastSpokeInSacrament')
      .limit(10)
      .onSnapshot((snap) => {
        const members = (docs(snap) ?? []).map((member) => ({
          ...member,
          displayName: `${member?.preferredName || member.firstName} ${member.lastName}`,
        }));

        set({ speakers: members, isLoading: false });
      });
  } catch {
    set({ isError: true });
  }
};
