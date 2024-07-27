import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { bishop } from '../../../configs/unit';
import { programIdShort, dateLongTime } from '../../../configs/dateFormats';
import { comingSunday, utc } from '../../../utils/date.utils';
import { db, docs } from '../../../utils/firebase.utils';
// layouts
import CoverLayout from './layouts/colorPage';
import EventsLayout from './layouts/events';
import ProgramOnlyLayout from './layouts/programOnly';
import ClassesLayout from './layouts/classes';
import ProgramNewHymn from './layouts/programNewHymn';

let unsubscribe = null; // eslint-disable-line

const Layout = styled.div`
  background-color: var(--color-white-1);
  width: 100%;
  min-height: 100vh;
`;

const ButtonLayout = styled.div`
  text-align: right;
  margin: var(--space-4) var(--space-4) 0 0;
`;

const programLayout = (layoutName = 'events') => {
  switch (layoutName) {
    case 'colorPage':
      return CoverLayout;
    case 'programOnly':
      return ProgramOnlyLayout;
    case 'classes':
      return ClassesLayout;
    case 'programNewHymn':
      return ProgramNewHymn;
    default:
      return EventsLayout;
  }
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

  const Content = useMemo(() => programLayout(programData.print_layout, programData.note), [programData.print_layout]);

  const onPrint = () => window.print();

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
        <Header />
        <div>{errorMessage}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <ButtonLayout className="print-button">
        <Button htmlType="button" onClick={onPrint}>
          Print
        </Button>
      </ButtonLayout>
      {loading ? <Loader /> : <Content data={programData} />}
    </Layout>
  );
}

export default ProgramPrint;
