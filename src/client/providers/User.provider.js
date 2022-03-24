import React, { useState, useEffect, createContext } from 'react';
import { node } from 'prop-types';

// utils
import { store as db, docs, auth } from '../utils/firebase.utils';
import catchify from '../utils/catchify.util';
import { buildPermissions } from '../utils/permissions.utils';

export const UserContext = createContext({ user: null, loading: true });

function UserProvider({ children }) {
  // hooks
  const [user, setUser] = useState({ user: null, loading: true });
  // handlers
  const filterUserData = (userAuth, userData) => ({
    // pull out the values we want from the larger object and return them below.
    displayName: `${userData?.firstName || ''} ${userData?.lastName || ''}`,
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
      if (!userAuth) return setUser({ user: null, loading: false });

      // const [, { claims = {} }] = await catchify(userAuth.getIdTokenResult());
      const [error, dbInfoSnapshots] = await catchify(
        db.collection('members').where('email', '==', userAuth?.email).get()
      );

      if (error) {
        console.error(error?.code || error);
        return setUser({ user: null, loading: false });
      }

      const userData = docs(dbInfoSnapshots);
      return setUser({ user: filterUserData(userAuth, userData[0]), loading: false });
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: node.isRequired,
};

export default UserProvider;
