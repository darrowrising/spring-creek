import React, { useState, useEffect, createContext } from 'react';
import { node } from 'prop-types';

// utils
import { db, allDocs, auth } from '../utils/firebase.utils';
import catchify from '../utils/catchify.util';

export const UserContext = createContext({ user: null, loading: true });

function UserProvider({ children }) {
    const [user, setUser] = useState({ user: null, loading: true });
    const filterPermissions = (roles, userRoles = []) => (
        userRoles
            .map(roleUid => roles.find(item => item.uid === roleUid))
            .map(role => role.permissions)
            .flat()
    );
    const filterUserData = (userAuth, claims, roles = [], userData) => ({
        // pull out the values we want from the larger object and return them below.
        displayName: `${userData?.firstName} ${userData?.lastName}`,
        email: userData?.email,
        status: userData?.status,
        organizations: userData?.orgs,
        permissions: filterPermissions(roles, userData?.roles || []),
        emailVerified: userAuth?.emailVerified,
        photoURL: userAuth?.photoURL,
        uid: userData?.uid
    });

    useEffect(() => {
        auth.onIdTokenChanged(async (userAuth) => {
            // no user is returned.
            if (!userAuth) return setUser({ user: null, loading: false });

            const [, { claims = {} }] = await catchify(userAuth.getIdTokenResult());
            const [error, dbInfoSnapshots] = await catchify(
                db.collection('members').where('uid', '==', userAuth.fid).get()
            );

            if (error) {
                console.error(error?.code || error);
                return setUser({ user: null, loading: false });
            }

            const [roles, userData] = allDocs(dbInfoSnapshots);
            return setUser({ user: filterUserData(userAuth, claims, roles, userData[0]), loading: false });
        });
    }, []);

    return (
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: node.isRequired
};

export default UserProvider;
