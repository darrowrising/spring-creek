import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Loader from '../../components/Loader';
import Program from '../../components/Program';
// import * as CSB from '../../../public/csb';
// import PDF from 'components/PDF';
import { bishop } from '../../configs/unit';
import { programIdShort, dateLongTime } from '../../configs/dateFormats';
import { comingSunday, utc } from '../../utils/date.utils';
import { db, docs } from '../../utils/firebase.utils';

let unsubscribe = null; // eslint-disable-line

const ProgramContainer = styled.div`
  width: 100%;

  && {
    max-width: var(--width-max-medium);
  }
`;

const initialState = {
  date: utc({ date: comingSunday(), format: dateLongTime }),
  presiding: bishop,
  program: [
    {
      type: 'talk',
      title: 'Speaker',
      value: 'TBA',
    },
  ],
};

function ProgramPage() {
  const [program, setProgram] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { programId } = useParams();

  useEffect(() => {
    const id = programId || utc({ date: comingSunday(), format: programIdShort });

    unsubscribe = db
      .collection('program')
      .where('id', '==', id)
      .onSnapshot((programSnap) => {
        const data = docs(programSnap)[0];
        console.log('data:', data);
        if (data) {
          setProgram({
            ...data,
            date: utc({ date: data.date, format: dateLongTime }),
          });
        }

        if (programId && !data) {
          setErrorMessage('A program can not be found for that data. Please try a different date.');
        }

        setLoading(false);
      });

    return () => unsubscribe();
  }, [programId]);

  if (errorMessage) return <div>{errorMessage}</div>;
  return <ProgramContainer>{loading ? <Loader /> : <Program data={program} />}</ProgramContainer>;
}

export default ProgramPage;
