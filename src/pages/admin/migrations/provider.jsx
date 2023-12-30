import { useState, useEffect, createContext, useContext } from 'react';
import { node } from 'prop-types';

// utils
import { db, docs, auth } from '../../../utils/firebase.utils';
// import { catchify } from '../utils/data.utils';

let unsubscribe;
const INITIAL_STATE = [];

const Context = createContext(INITIAL_STATE);
export const useBackups = () => useContext(Context);

function BackupProvider({ children }) {
  const [backups, setBackups] = useState(INITIAL_STATE);

  useEffect(() => {
    unsubscribe = db.collection('backups').onSnapshot((snap) => {
      const list = docs(snap);
      setBackups(list);
    });

    return () => unsubscribe();
  }, []);

  return <Context.Provider value={{ backups }}>{children}</Context.Provider>;
}

BackupProvider.propTypes = {
  children: node.isRequired,
};

export default BackupProvider;
