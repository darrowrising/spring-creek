import { useState, useEffect, createContext, useContext } from 'react';
import { node } from 'prop-types';

// utils
import { db, docs, auth } from '../utils/firebase.utils';
import { catchify } from '../utils/data.utils';
import { buildPermissions } from '../utils/permissions.utils';
import { createDisplayName } from '../factories/member';

const INITIAL_STATE = {
  user: {},
  isUserLoading: true,
  setUser: () => undefined,
};

const Context = createContext(INITIAL_STATE);
export const useUser = () => useContext(Context);

function UserProvider({ children }) {
  const [user, setUser] = useState(INITIAL_STATE.user);
  const [isUserLoading, setIsUserLoading] = useState(INITIAL_STATE.isUserLoading);

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
      if (!userAuth) {
        setUser({});
        setIsUserLoading(false);

        return false;
      }

      // const [, { claims = {} }] = await catchify(userAuth.getIdTokenResult());
      const [error, dbInfoSnapshots] = await catchify(
        db.collection('members').where('email', '==', userAuth?.email).get()
      );

      if (error) {
        console.error(error?.code || error);
        setUser({});
        setIsUserLoading(false);

        return false;
      }

      const userData = docs(dbInfoSnapshots);
      setUser(filterUserData(userAuth, userData[0]));
      setIsUserLoading(false);

      return true;
    });
  }, []);

  return <Context.Provider value={{ user, isUserLoading }}>{children}</Context.Provider>;
}

UserProvider.propTypes = {
  children: node.isRequired,
};

export default UserProvider;
