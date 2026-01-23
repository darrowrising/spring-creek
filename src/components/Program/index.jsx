import styled from 'styled-components';
import { shape, bool } from 'prop-types';

import Leaders from '../Leaders';
import { PageHeading } from '../Heading';
import Link from '../Link';

import { useUser } from '../../providers/user.provider';
import { fadeIn } from '../../styles/animations';

import Lyrics from './Lyrics';

const ProgramWrapper = styled.div`
  max-width: var(--width-max-medium);
  animation: 0.5s ${fadeIn} ease;
  line-height: 1.5em;
  font-size: ${({ $speakerCount, $isPrint }) => ($speakerCount > 5 && $isPrint ? '0.8em' : '1em')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .sacrament-hymn {
    margin-top: 1.3vh;
  }
`;

const Date = styled.div`
  text-align: center;
  font-size: 0.8em;
  padding: var(--space-3) 0 var(--space-5);

  & > span {
    text-transform: uppercase;
  }
`;

const SubHeading = styled.h3`
  font-size: 1em;
  text-align: center;
  padding: 0.8em 0;

  & > strong {
    display: inline-block;
    padding: 0.8em 0;
  }
`;

const SpeakerContainer = styled.div`
  padding-bottom: 2vh;
`;

const Meeting = styled.div`
  text-align: center;
  font-size: 1.2em;
  font-weight: 700;
  padding: var(--space-10) 0;
`;

const MusicalNumberContainer = styled.div`
  text-align: center;
  padding: 1vh 0; /* var(--space-5) 0; */
`;

const MusicalTitle = styled.strong`
  display: block;
  font-weight: 700;
`;

const MusicalNumber = styled.em``;

function Program({ data = { program: [] }, isPrint, ...rest }) {
  const program = (data.program ?? [{}]).filter((obj) => obj);
  const { user } = useUser();

  return (
    <ProgramWrapper {...rest} $speakerCount={program.length} $isPrint={isPrint} data-testid="program-component">
      <PageHeading>Sacrament Meeting</PageHeading>
      <Date className="date">
        {data.date} <span>{user.unit?.meetingTime}</span>
      </Date>

      <section>
        <Leaders title="Presiding" value={data?.presiding} />
        <Leaders title="Conducting" value={data?.conducting} />
        <Leaders title="Chorister" value={data?.chorister} />
        <Leaders title="Organist" value={data?.organist} />
      </section>

      <SubHeading>Welcome</SubHeading>

      <section>
        <Leaders
          title="Opening Hymn"
          value={data?.opening_hymn && `#${data?.opening_hymn}`}
          subValue={data.opening_hymn_title}
          helperText={data.opening_hymn_extra}
        />
        <Leaders title="Invocation" value={data?.invocation} />
      </section>

      <SubHeading>Ward and Stake Business</SubHeading>

      <Leaders
        title="Sacrament Hymn"
        value={data?.sacrament_hymn && `#${data?.sacrament_hymn}`}
        subValue={data.sacrament_hymn_title}
        helperText={data.sacrament_hymn_extra}
        className="sacrament-hymn"
      />

      <SubHeading>
        <strong>Administration of the Sacrament</strong>
      </SubHeading>

      <SpeakerContainer>
        {program
          .sort((a, b) => a.priority - b.priority)
          .map(({ type = '', priority, value, title, lyrics }) => {
            switch (type) {
              case 'music': {
                return (
                  <MusicalNumberContainer key={`${value}_${priority}`}>
                    <MusicalTitle>{title}</MusicalTitle>
                    <MusicalNumber>{value}</MusicalNumber>
                    {lyrics && (
                      <Link href="#lyrics" style={{ display: 'block' }}>
                        <em>see lyrics below</em>
                      </Link>
                    )}
                  </MusicalNumberContainer>
                );
              }
              case 'meeting': {
                return <Meeting key={`${value}_${priority}`}>{value}</Meeting>;
              }
              case 'hymn': {
                return (
                  <Leaders
                    title="Intermediate Hymn"
                    value={value && `#${value}`}
                    subValue={title}
                    className="intermediate-hymn"
                    style={{
                      paddingTop: '16px',
                    }}
                    key={`${value}_${priority}`}
                  />
                );
              }
              default: {
                return <Leaders title={title} value={value} key={`${value}_${priority}`} />;
              }
            }
          })}
      </SpeakerContainer>

      <section>
        <Leaders
          title="Closing Hymn"
          value={data?.closing_hymn && `#${data?.closing_hymn}`}
          subValue={data.closing_hymn_title}
          helperText={data.closing_hymn_extra}
          className="closing-hymn"
        />

        <Leaders title="Benediction" value={data?.benediction || 'TBA'} style={{ marginBottom: '40px' }} />
      </section>
      <Lyrics title={data?.lyrics?.title} lyrics={data?.lyrics?.words} />
    </ProgramWrapper>
  );
}

Program.propTypes = {
  data: shape({}),
  isPrint: bool,
};

export default styled(Program)``;
