import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { node } from 'prop-types';

import { db, docs } from '../utils/firebase.utils';
import { hasData } from '../utils/data.utils';
import { dayjs } from '../utils/date.utils';
import { createDisplayName } from '../factories/member';

const INITIAL_STATE = {
  notifications: {
    members: 0,
    moderation: 0,
  },
  members: [],
  newMembers: [],
  announcements: [],
  loading: true,
};
const Context = createContext(INITIAL_STATE);
export const useAdminContext = () => useContext(Context);

const YOUTH_YEAR = dayjs().subtract(12, 'year').format('YYYY');
const ADULT_YEAR = dayjs().subtract(19, 'year').format('YYYY');

const createGroup = (year) => {
  if (year <= ADULT_YEAR) return 'adult';
  else if (year <= YOUTH_YEAR) return 'youth';
  else return 'primary';
};

function AdminProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_STATE.members);
  const [newMembers, setNewMembers] = useState(INITIAL_STATE.newMembers);
  const [notifications, setNotifications] = useState(INITIAL_STATE.notifications);
  const [announcements, setAnnouncements] = useState(INITIAL_STATE.announcements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const announcementsUnsubscribe = db
      .collection('announcements')
      .where('moderate', '==', true)
      .onSnapshot((snap) => {
        const data = docs(snap) || [];

        setNotifications((prev) => ({
          ...prev,
          moderation: data.length,
        }));
        setAnnouncements(data);
        setLoading(false);
      });

    const membersUnsubscribe = db.collection('members').onSnapshot((snap) => {
      const data = docs(snap) || [];
      const newMembersList = data.filter(({ status }) => status === 'pending');

      setNotifications((prev) => ({
        ...prev,
        members: newMembersList.length,
      }));

      setMembers(
        data.map((member) => ({
          ...member,
          displayName: createDisplayName(member),
          ageGroup: createGroup(member.year || '1980'),
        }))
      );
      if (hasData(newMembersList))
        setNewMembers(
          newMembersList.map((member) => ({
            ...member,
            displayName: createDisplayName(member),
            ageGroup: createGroup(member.year || '1980'),
          }))
        );
      setLoading(false);
    });

    return () => {
      announcementsUnsubscribe();
      membersUnsubscribe();
    };
  }, []);

  const providerValues = useMemo(
    () => ({
      members,
      newMembers,
      notifications,
      announcements,
      loading,
    }),
    [members, announcements, loading]
  );

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <Context.Provider value={providerValues}>{children}</Context.Provider>;
}

AdminProvider.propTypes = {
  children: node.isRequired,
};

export default AdminProvider;
