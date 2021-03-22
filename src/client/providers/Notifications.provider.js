import React, { useState, useEffect, createContext } from 'react';
import { node } from 'prop-types';

// utils
import { getNewMembers, newMembersUnsubscribe } from '../utils/notifications.utils';

const initialState = {
    loading: true,
    newMembers: [],
};

export const NotificationsContext = createContext(initialState);

function NotificationsProvider({ children }) {
    // hooks
    const [notifications, setNotifications] = useState(initialState);
    // handlers

    useEffect(() => {
        // new members
        getNewMembers(setNotifications);

        return () => {
            newMembersUnsubscribe();
        };
    }, []);

    return <NotificationsContext.Provider value={notifications}>{children}</NotificationsContext.Provider>;
}

NotificationsProvider.propTypes = {
    children: node.isRequired,
};

export default NotificationsProvider;
