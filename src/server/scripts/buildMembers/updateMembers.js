import { generate as uid } from 'shortid';
// utils
import { store as db, docs } from '../../../client/utils/firebase.utils';
import { utc } from '../../../client/utils/date.utils';
// data
import springCreekMembers from './tempMemberList.json';

let membersUpdated = 0;

const memberRef = db.collection('members');
// factories
const createMember = ({ firstName = '', lastName = '', ageGroup = 'adult' }) => ({
  createdOn: utc(),
  email: '',
  firstName,
  lastName,
  preferredName: '',
  status: 'inactive',
  ageGroup,
  uid: uid(),
});
// fetch handlers
const fetchMembers = async () => memberRef.get();
const saveMemberData = async (memberData, status) => {
  if (status === 'new') {
    const member = createMember(memberData);
    const { uid: docId } = member;
    await memberRef.doc(docId).set(member);
    membersUpdated += 1;
  } else {
    const { uid: docId } = memberData;
    await memberRef.doc(docId).update(memberData);
    membersUpdated += 1;
  }
};

fetchMembers().then(async (membersSnapshot) => {
  const members = docs(membersSnapshot);

  for (let i = 0; springCreekMembers.length > i; i += 1) {
    const { firstName, lastName, age: ageStr } = springCreekMembers[i];

    const firebaseRecord = members.find(
      ({ firstName: first, lastName: last }) => firstName === first && lastName === last
    );
    const age = Number(ageStr);
    let ageGroup = 'adult';

    if (age <= 18 && age >= 11) ageGroup = 'youth';
    if (age <= 10) ageGroup = 'primary';

    if (!firebaseRecord) await saveMemberData({ firstName, lastName, ageGroup }, 'new');
    if (age === 19 || age === 11) await saveMemberData({ ...firebaseRecord, ageGroup });
  }
  console.log(`${membersUpdated} members records were updated`);
  process.exit(0);
});
