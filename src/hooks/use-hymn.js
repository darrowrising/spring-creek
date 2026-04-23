import { useCallback } from 'react';

import { db, docs } from '../utils/firebase.utils';

function useHymn() {
  const getHymns = useCallback(async ({ number } = {}) => {
    const hasNumber = number !== undefined && number !== null && number !== '';
    const query = hasNumber ? db.collection('hymns').where('number', '==', Number(number)) : db.collection('hymns');

    const snap = await query.get();
    const allHymns = docs(snap);

    return hasNumber ? allHymns[0] : allHymns;
  }, []);

  return { getHymns };
}

export default useHymn;
