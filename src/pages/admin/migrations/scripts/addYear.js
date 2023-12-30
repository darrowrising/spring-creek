import { db, docs } from '../../../../utils/firebase.utils';
import { catchify, uniq } from '../../../../utils/data.utils';

import json from './lds.json';

export const addYear = async () => {
  const [error, data] = await catchify(db.collection('members').get());

  if (error) return;

  docs(data).forEach(({ firstName, lastName, uid }) => {
    const { year = '' } =
      json.find(({ firstName: first, lastName: last }) => first === firstName && last === lastName) ?? {};

    db.collection('members').doc(uid).update({
      year,
    });
  });
};
