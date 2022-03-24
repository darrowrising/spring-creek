import shortId from 'shortid';
import catchify from '../../utils/catchify.util';
// utils
import { store as db } from '../../../js/utils/fireDB';
import { utc } from '../../utils/date.utils';
import { GAEvent } from '../../components/Analytics/Analytics';

export async function saveQuestion(data, set) {
  const uid = shortId.generate();
  const { question, category } = data;

  const [error] = await catchify(
    db.collection('questions').doc(uid).set({
      question,
      category,
      uid,
      dateSubmitted: utc(),
    })
  );

  if (error) {
    GAEvent({
      category: 'Anonymous Questions',
      action: `Firebase Response`,
      label: 'Error',
    });
    return set({
      errorMessage: 'Something went wrong. Unable to save question. Please refresh and try again.',
    });
  }

  GAEvent({
    category: 'Anonymous Questions',
    action: `Click | Send Btn`,
    label: 'Successful Submission',
  });

  set({ success: true });
}
