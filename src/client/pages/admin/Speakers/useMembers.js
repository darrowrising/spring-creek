import { createMemberName } from '../../../factories/member.factory';
import { store, docs } from '../../../utils/firebase.utils';

async function useMembers() {
  const membersSnapshot = await store.collection('members').get();
  const members = docs(membersSnapshot).map((member) => ({ ...member, displayName: createMemberName(member) }));

  return members;
}

export default useMembers;
