import { useState, useEffect } from 'react';
import styled from 'styled-components';
// import {} from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Button';
import { dateShort } from '../../configs/dateFormats';
import { utc } from '../../utils/date.utils';
import { db, docs } from '../../utils/firebase.utils';

// #region styles
const Page = styled.div`
  width: 100%;
  max-width: var(--width-max-medium);
`;
const Nav = styled.nav`
  padding-bottom: var(--space-4);
`;
const Header = styled.header``;
const Info = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2``;
const EndDate = styled.span`
  font-size: 0.8em;
`;
// #endregion styles

// #region main
const INITIAL_STATE = {
  title: '',
  endDate: '',
};

function SingleAnnouncement() {
  const [event, setEvent] = useState(INITIAL_STATE);
  const navigate = useNavigate();
  const { id } = useParams();

  const { title, endDate } = event;

  useEffect(() => {
    if (id)
      db.collection('announcements')
        .where('uid', '==', id)
        .get()
        .then((snap) => {
          const data = docs(snap)[0];
          setEvent(data);
        });
  }, [id]);

  return (
    <Page>
      <Nav>
        <Button onClick={() => navigate('/announcements')}>Back</Button>
      </Nav>
      <Header>
        <Info>
          <Title>{title}</Title>
          {endDate && <EndDate>ends on {utc({ date: endDate, format: dateShort })}</EndDate>}
        </Info>
      </Header>
    </Page>
  );
}
// #endregion main

export default SingleAnnouncement;
