import styled from 'styled-components';
import { shape, bool } from 'prop-types';

import Leaders from '../Leaders';
import { PageHeading } from '../Heading';
import Link from '../Link';
// import * as CSB from '../../../public/csb';
// import PDF from 'src/components/PDF';
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
`;

const SubHeading = styled.h3`
  font-size: 1em;
  text-align: center;
  padding: 0.8em 0;
  /* padding: 0.8vh 0; */

  & > strong {
    display: inline-block;
    padding: 0.8em 0;
    /* padding: 0.8vh 0; */
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

function SecondHalf({ data = { program: [] }, isPrint, ...rest }) {
  return (
    <ProgramWrapper {...rest} $speakerCount={data.program.length} $isPrint={isPrint}>
      <SpeakerContainer>
        {data.program
          .sort((a, b) => a.priority - b.priority)
          .flatMap(({ type, priority, value, title, lyrics }, index) => {
            if (index > 5) {
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
                      value={data?.intermediate_hymn && `#${data?.intermediate_hymn}`}
                      subValue={data.intermediate_hymn_title}
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
            } else {
              return [];
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

SecondHalf.propTypes = {
  data: shape({}),
  isPrint: bool,
};

export default styled(SecondHalf)``;
