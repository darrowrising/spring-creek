import { useState, useEffect, createContext, useContext } from 'react';
import { node } from 'prop-types';

// utils
import { db, docs, auth } from '../utils/firebase.utils';
import { catchify } from '../utils/data.utils';
import { buildPermissions } from '../utils/permissions.utils';
import { createDisplayName } from '../factories/member';

const INITIAL_STATE = {
  user: {},
  loading: true,
};

const Context = createContext(INITIAL_STATE);
export const useUser = () => useContext(Context);

function UserProvider({ children }) {
  const [user, setUser] = useState(INITIAL_STATE);

  const filterUserData = (userAuth, userData = {}) => ({
    // pull out the values we want from the larger object and return them below.
    displayName: createDisplayName(userData),
    email: userData?.email || '',
    status: userData?.status || '',
    organizations: userData?.orgs || [],
    permissions: buildPermissions(userData) || [],
    emailVerified: userAuth?.emailVerified || false,
    photoURL: userAuth?.photoURL || '',
    uid: userData?.uid || '',
  });

  useEffect(() => {
    auth.onIdTokenChanged(async (userAuth) => {
      // no user is returned.
      if (!userAuth) return setUser({ user: {}, loading: false });

      // const [, { claims = {} }] = await catchify(userAuth.getIdTokenResult());
      const [error, dbInfoSnapshots] = await catchify(
        db.collection('members').where('email', '==', userAuth?.email).get()
      );

      if (error) {
        console.error(error?.code || error);
        return setUser({ user: {}, loading: false });
      }

      const userData = docs(dbInfoSnapshots);
      return setUser({ user: filterUserData(userAuth, userData[0]), loading: false });
    });
  }, []);

  return <Context.Provider value={user}>{children}</Context.Provider>;
}

UserProvider.propTypes = {
  children: node.isRequired,
};

export default UserProvider;
