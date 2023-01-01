import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import theme from 'theme';
import Loading from 'react-loading';
// import { NavLink } from 'react-router-dom';
import { shape } from 'prop-types';

// components
import Content from './Content';
import Cover from './Cover';
// utils
import { fbDocId } from '../../../js/utils/date';
import { getProgramData, unsubscribe } from '../../../js/containers/program/Program.utils';
import { handleState } from '../../utils/state.utils';
// configs
import dateFormats from '../../../js/configs/dateFormats';
import { meetingTimes } from '../../../configs/unit.config';

const PrintContainer = styled.div`
  font-size: 0.6rem;
  width: 1055px;

  .date {
    display: none;
  }

  h2 {
    margin-top: 0;
  }

  .content {
    background-color: ${theme('color_white_2')};
  }

  @media print {
    overflow-x: hidden !important;

    .content {
      background-color: none;
    }
  }
`;

const Page = styled.section`
  display: grid;
  grid-template-columns: 50% 50%;
  height: 815px;

  & > div {
    padding: 2em;

    &:first-child {
      padding-left: 3em;
    }

    &:last-child {
      padding-right: 3em;
    }
  }

  h3 {
    font-size: 1em;
  }

  .musical-title {
    font-weight: bold;
  }

  .helperText-wrapper,
  .subValue-wrapper {
    margin: 0;
    padding: 0;
  }
`;

const initialState = {
  dateTime: moment(`${fbDocId}_${meetingTimes[0]}`, dateFormats.fbDocId_long).format(dateFormats.dateTime),
  date: moment(`${fbDocId}_${meetingTimes[0]}`, dateFormats.fbDocId_long).format(dateFormats.longDate),
  presiding: 'Bishop Vaughn Kinghorn',
  program: [
    {
      type: 'talk',
      title: 'Speaker',
      value: 'TBA',
    },
  ],
  time: '00:00',
  loading: true,
  errorMessage: '',
};

function PrintProgram({ history }) {
  // hooks
  const [state, setState] = useState(initialState);
  // data
  const { loading } = state;
  const { pathname } = history.location;
  // handlers
  const set = (update) => handleState(update, setState);

  useEffect(() => {
    const programDate = pathname.split('program/print/')[1];

    getProgramData(set, programDate);

    return () => unsubscribe();
  }, [pathname]);

  return (
    <PrintContainer>
      {loading ? (
        <div className="loading">
          <Loading type="bars" color="#8FC1E3" />
        </div>
      ) : (
        <>
          <Page>
            <Cover program={state} />
            <Content program={state} />
          </Page>
        </>
      )}
    </PrintContainer>
  );
}

PrintProgram.propTypes = {
  history: shape().isRequired,
};

export default PrintProgram;
