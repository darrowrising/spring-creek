import shortId from 'shortid';
/* TODO: Remove this eslint disable */
/* eslint-disable */
// configs
import { loginRedirectDefault } from '../../../configs/menu.configs';
// utils
import { store as db, docs, createMember } from '../../utils/firebase.utils';
import { utc } from '../../utils/date.utils';
import catchify from '../../utils/catchify.util';
import { GAEvent } from '../../components/Analytics/Analytics';

export async function handleSubmit(values, set) {
    const { firstName, lastName, email, password } = values;
    set({ loading: true });

    const [error, snap] = await catchify(db.collection('members').where('email', '==', values.email).get());

    if (error) {
        GAEvent({
            category: 'SignUp',
            action: 'Error: Getting Member',
            label: `${firstName}_${lastName}_${email}`,
        });
        return set({ loading: false, errorMsg: 'Something went wrong, please try again.' });
    }

    const user = docs(snap)[0];
    const userData = {
        uid: user?.uid || shortId.generate(),
        firstName,
        lastName,
        email,
        lastVisited: utc(),
        status: 'pending',
        organizations: user?.organizations || [],
        roles: user?.roles || [],
        callings: user?.callings || [],
        createdOn: user?.createdOn || utc(),
    };
    const ref = db.collection('members').doc(userData.uid);

    if (user?.lastVisited) {
        GAEvent({
            category: 'SignUp',
            action: 'Error: Email Already Exists',
            label: `${firstName}_${lastName}_${email}`,
        });
        return set({ errorMsg: 'This email is already in use.' });
    }
    if (user?.email) {
        ref.update(userData);
    } else {
        ref.set(userData);
    }

    createMember(email, password)
        .then(() => {
            GAEvent({
                category: 'SignUp',
                action: 'Account Created',
            });
            set({ loading: false, errorMsg: '', redirect: loginRedirectDefault });
        })
        .catch((err) => {
            console.error(err);
            GAEvent({
                category: 'SignUp',
                action: 'Error: Creating Account',
                label: `${firstName}_${lastName}_${email}`,
            });
            set({ errorMsg: 'Sorry, we were unable to create an account at this time. Please try again.' });
        });

    return null;
}
