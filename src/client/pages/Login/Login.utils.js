// configs
import { loginRedirectDefault } from '../../../configs/menu.configs';
// utils
import { store as db, docs, signIn } from '../../utils/firebase.utils';
import { GAEvent } from '../../components/Analytics/Analytics';
import catchify from '../../utils/catchify.util';
import { getStorage, removeStorage } from '../../utils/localStorage.utils';
import { dayjs } from '../../utils/date.utils';

export const handleRedirect = (set) => {
  const redirectPath = getStorage('loginRedirect');
  set({ redirect: redirectPath || loginRedirectDefault });

  if (redirectPath) removeStorage('loginRedirect');
};

export async function handleSubmit(values, set) {
  const { email, password } = values;
  set({ loading: true });

  const [error, results] = await catchify(
    Promise.all([signIn(email, password), db.collection('members').where('email', '==', email).get()])
  );

  if (error) {
    GAEvent({
      category: 'Login',
      action: 'Error: Loging in',
      label: `${email.split('@')[0]}`,
    });
    console.log(error);
    return set({ loading: false, errorMsg: 'Email and/or password incorrect. Please try again.' });
  }

  const [, memberSnap] = results;
  const { uid } = docs(memberSnap)[0];

  db.collection('members').doc(uid).update({ lastVisited: dayjs.utc().format() });

  GAEvent({
    category: 'Login',
    action: 'Member logged in',
    label: `${email.split('@')[0]}`,
  });

  set({ loading: false, errorMsg: '', redirect: loginRedirectDefault });

  return null;
}
