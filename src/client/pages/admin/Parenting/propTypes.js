import { string, shape, arrayOf, number } from 'prop-types';

export const questionsPropTypes = arrayOf(
  shape({
    id: string,
    question: string,
    priority: number,
    options: arrayOf(shape({ optionId: string, name: string })),
    type: string,
  })
);
