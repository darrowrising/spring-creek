import styled from 'styled-components';

import Link from '../../components/Link';
import { GAEvent } from '../../components/Analytics';
import InitiativeSample from '../temp/initiative/Sample';
import { useUser } from '../../providers/user.provider';

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

const Col = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const SubHeading = styled.h3`
  padding-top: var(--space-10);
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
      <Row>
        <Col>
          <SubHeading>Sacrament Meeting</SubHeading>
          <div>{user.unit?.meetingTime}</div>
        </Col>
        <Col>
          <SubHeading>Stake Website</SubHeading>
          <Link href="https://farmingtonwest.org/">Farmington West Stake</Link>
        </Col>
      </Row>
      <InitiativeSample />
    </HomeContainer>
  );
}

export default Home;
