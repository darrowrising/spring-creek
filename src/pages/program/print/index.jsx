import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Loader from '../../../components/Loader';
import { bishop } from '../../../configs/unit';
import { programIdShort, dateLongTime } from '../../../configs/dateFormats';
import { comingSunday, utc } from '../../../utils/date.utils';
import { db, docs } from '../../../utils/firebase.utils';
// layouts
import CoverLayout from './layouts/colorPage';
import EventsLayout from './layouts/events';
import ProgramOnlyLayout from './layouts/programOnly';

let unsubscribe = null; // eslint-disable-line

const Layout = styled.div`
  background-color: var(--color-white-1);
  width: 100%;
`;

const programLayout = (layoutName = 'events') => {
  // if (layoutName === 'events') return EventsLayout;
  if (layoutName === 'colorPage') return CoverLayout;
  if (layoutName === 'programOnly') return ProgramOnlyLayout;
  return EventsLayout;
};

const INITIAL_STATE = {
  date: utc({ date: comingSunday(), format: dateLongTime }),
  presiding: bishop,
  program: [
    {
      type: 'talk',
      title: 'Speaker',
      value: 'TBA',
    },
  ],
  printLayout: 'events',
};

function ProgramPrint() {
  const [programData, setProgramData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { programId } = useParams();

  const Content = useMemo(() => programLayout(programData.printLayout), [programData.printLayout]);

  useEffect(() => {
    const id = programId || utc({ date: comingSunday(), format: programIdShort });

    unsubscribe = db
      .collection('program')
      .where('id', '==', id)
      .onSnapshot((programSnap) => {
        const data = docs(programSnap)[0];

        if (data) {
          setProgramData({
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
  }, []);

  if (errorMessage) {
    return (
      <Layout>
        <div>{errorMessage}</div>
      </Layout>
    );
  }

  return <Layout>{loading ? <Loader /> : <Content data={programData} />}</Layout>;
}

export default ProgramPrint;
