import React from 'react';
import styled, { keyframes } from 'styled-components';
import { shape } from 'prop-types';

import theme from 'theme';

// components
import Heading from '../../components/Heading';
import Leaders from '../../../js/components/leaders/Leaders';
import * as CSB from '../../static/csb';
import PDF from '../../components/PDF/PDF';

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

const ContentContainer = styled.div`
  animation: 0.5s ${fadeIn} ease;
  opacity: 1;
  display: grid;
  row-gap: 0.6em;
  position: relative;
`;

const HeadingWrapper = styled.header`
  border-bottom: 1px solid ${theme('color_grey_2')};
  text-align: center;
  width: 100%;

  & > ${Heading} {
    font-size: 1.4em;
    color: ${theme('color_blue_2')};
  }
`;

function Content({ program }) {
  const csbHymns = Object.keys(program)
    .filter((item) => item.includes('fileName'))
    .filter((item) => program[item])
    .map((item) => program[item]);

  return (
    <ContentContainer className="content">
      <HeadingWrapper>
        <Heading>Sacrament Meeting</Heading>
        <div className="date">{program.dateTime}</div>
      </HeadingWrapper>

      <div>
        <Leaders title="Presiding" value={program?.presiding} />
        <Leaders title="Conducting" value={program?.conducting} />
        <Leaders title="Chorister" value={program?.chorister} />
        <Leaders title="Organist" value={program?.organist} />
      </div>

      <h3 className="center">Welcome</h3>

      <div>
        <Leaders
          title="Opening Hymn"
          value={program?.opening_hymn && `#${program?.opening_hymn}`}
          subValue={program.opening_hymn_title}
          helperText={program.opening_hymn_extra}
        />
        <Leaders title="Invocation" value={program?.invocation} />
      </div>

      <h3 className="center">Ward and Stake Business</h3>

      <Leaders
        title="Sacrament Hymn"
        value={program?.sacrament_hymn && `#${program?.sacrament_hymn}`}
        subValue={program.sacrament_hymn_title}
        helperText={program.sacrament_hymn_extra}
      />

      <h3 className="center bold sacrament">Administration of the Sacrament</h3>
      {/* eslint-disable react/jsx-indent, indent */}
      {csbHymns.length !== 0
        ? csbHymns.map((csbHymn) => (
            <div className="csb-wrapper">
              <PDF file={CSB[csbHymn]} />
            </div>
          ))
        : null}
      {/* eslint-enable react/jsx-indent, indent */}

      {program.program
        .sort((a, b) => a.priority - b.priority)
        .map((item) => {
          switch (item.type) {
            case 'music': {
              return (
                <div className="center musical-number-wrapper">
                  <div className="musical-title">{item.title}</div>
                  <div className="musical-number">{item.value}</div>
                </div>
              );
            }
            case 'meeting': {
              return <div className="testimony-meeting center bold">{item.value}</div>;
            }
            case 'hymn': {
              return (
                <Leaders
                  title="Intermediate Hymn"
                  value={program?.intermediate_hymn && `#${program?.intermediate_hymn}`}
                  subValue={program.intermediate_hymn_title}
                  className="intermediate-hymn"
                />
              );
            }
            default: {
              return <Leaders title={item.title} value={item.value} />;
            }
          }
        })}

      <Leaders
        title="Closing Hymn"
        value={program?.closing_hymn && `#${program?.closing_hymn}`}
        subValue={program.closing_hymn_title}
        helperText={program.closing_hymn_extra}
        className="closing-hymn"
      />

      <Leaders title="Benediction" value={program?.benediction || 'TBA'} />
    </ContentContainer>
  );
}

Content.propTypes = {
  program: shape().isRequired,
};

export default Content;
