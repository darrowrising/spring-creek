import styled from 'styled-components';

import Link from '../../components/Link';
import { GAEvent } from '../../components/Analytics';
import InitiativeSample from '../temp/initiative/Sample';
import { useUser } from '../../providers/user.provider';
import UpcomingAnnouncements from './UpcomingAnnouncements';

const HomeContainer = styled.div`
  width: 100%;
  padding-top: var(--space-4);
`;

const Row = styled.section`
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const LinkBase = styled(Link)`
  align-items: center;
  border-radius: 4px;
  color: var(--color-white-1);
  display: flex;
  justify-content: center;
  height: 150px;
  font-weight: bold;
  transition: opacity var(--transition-medium);
  font-size: 1.2em;

  &&:hover {
    color: var(--color-white-1);
    opacity: 0.8;
    text-decoration: none;
  }
`;

const ProgramLink = styled(LinkBase)`
  background-color: var(--color-blue-2);
`;

const AnnouncementsLink = styled(LinkBase)`
  background-color: var(--color-blue-3);
`;

const MeetingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-10);
`;

const SubHeading = styled.h3`
  margin: 0;
`;

function handleClick(event) {
  const { currentTarget } = event;
  const label = currentTarget.getAttribute('href').replace('/', '');

  GAEvent({
    category: 'User',
    action: 'Home Page Menu Clicked',
    label,
  });
}

function Home() {
  const { user } = useUser();

  return (
    <HomeContainer>
      <Row>
        <ProgramLink to="/program" onClick={handleClick}>
          Sacrament Program
        </ProgramLink>
        <AnnouncementsLink to="/announcements" onClick={handleClick}>
          Announcements
        </AnnouncementsLink>
      </Row>
      <MeetingInfo>
        <SubHeading>Sacrament Meeting</SubHeading>
        <div>{user.unit?.meetingTime}</div>
      </MeetingInfo>
      <UpcomingAnnouncements />
      <InitiativeSample />
    </HomeContainer>
  );
}

export default Home;
