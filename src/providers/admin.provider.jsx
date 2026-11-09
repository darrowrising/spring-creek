import { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { node } from 'prop-types';

import { db, docs } from '../utils/firebase.utils';
import { hasData } from '../utils/data.utils';
import { deleteOutdatedEvents, hasPendingEdit } from '../utils/announcements.utils';
import { dayjs, isAfter } from '../utils/date.utils';
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
  if (year <= YOUTH_YEAR) return 'youth';

  return 'primary';
};

const isActivePendingNew = (event) => event.moderate === true && (!event.endDate || !isAfter(event.endDate));

const isActivePendingEdit = (event) => hasPendingEdit(event) && (!event.endDate || !isAfter(event.endDate));

const mergeModerationQueue = (newSubmissions = [], pendingEdits = []) => {
  const byUid = new Map();

  [...newSubmissions, ...pendingEdits].forEach((event) => {
    if (!event?.uid) return;
    byUid.set(event.uid, event);
  });

  return [...byUid.values()];
};

function AdminProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_STATE.members);
  const [newMembers, setNewMembers] = useState(INITIAL_STATE.newMembers);
  const [notifications, setNotifications] = useState(INITIAL_STATE.notifications);
  const [announcements, setAnnouncements] = useState(INITIAL_STATE.announcements);
  const [loading, setLoading] = useState(true);
  const newSubmissionsRef = useRef([]);
  const pendingEditsRef = useRef([]);

  useEffect(() => {
    const publishModeration = () => {
      const pending = mergeModerationQueue(newSubmissionsRef.current, pendingEditsRef.current);
      deleteOutdatedEvents(pending);
      setNotifications((prev) => ({
        ...prev,
        moderation: pending.length,
      }));
      setAnnouncements(pending);
      setLoading(false);
    };

    const announcementsUnsubscribe = db
      .collection('announcements')
      .where('moderate', '==', true)
      .onSnapshot((snap) => {
        newSubmissionsRef.current = (docs(snap) || []).filter(isActivePendingNew);
        publishModeration();
      });

    const pendingEditsUnsubscribe = db
      .collection('announcements')
      .where('hasPendingEdit', '==', true)
      .onSnapshot((snap) => {
        pendingEditsRef.current = (docs(snap) || []).filter(isActivePendingEdit);
        publishModeration();
      });

    const membersUnsubscribe = db.collection('members').onSnapshot((snap) => {
      const data = docs(snap) || [];
      const newMembersList = data.filter(({ status }) => status === 'pending');

      setNotifications((prev) => ({
        ...prev,
        members: newMembersList.length,
      }));

      setMembers(
        data
          .map((member) => ({
            ...member,
            displayName: createDisplayName(member),
            ageGroup: createGroup(member.year || '1980'),
          }))
          .map((member) => ({
            ...member,
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
      pendingEditsUnsubscribe();
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
    [members, newMembers, notifications, announcements, loading]
  );

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <Context.Provider value={providerValues}>{children}</Context.Provider>;
}

AdminProvider.propTypes = {
  children: node.isRequired,
};

export default AdminProvider;
