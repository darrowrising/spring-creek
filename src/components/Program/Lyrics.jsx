import React from 'react';
import styled from 'styled-components';
import { string } from 'prop-types';

import { mobileMaxWidth } from '../../styles/variables';

const LyricsContainer = styled.div`
  padding-top: var(--space-5);
`;

const LyricsBanner = styled.div`
  background-color: var(--color-grey-3);
  color: var(--color-grey-1);
  text-align: left;
  text-indent: var(--space-3);
  font-size: 0.6em;
`;

const LyricsHeading = styled.h3`
  color: var(--color-blue-2);
  font-family: var(--font-brand);
  font-size: 1.6em;
  padding-top: var(--space-5);
  text-align: center;
`;

const LyricWrapper = styled.div`
  text-align: left;
  display: flex;
  justify-content: center;
  padding-left: 10%;

  @media (max-width: ${mobileMaxWidth}) {
    padding-left: 0;
  }
`;

const buildMarkup = (song) => {
  const split = song.split('\n');
  const lastIndex = split.at(-1);

  return split
    .map((line, index) => {
      if (index === 0) return '<p>';
      if (lastIndex === index) return '</p>';
      if (line === '') return '</p><p>';
      return `<span>${line}</span></br>`;
    })
    .join('');
};

function Lyrics({ title, lyrics }) {
  if (!lyrics) return null;

  const markup = buildMarkup(lyrics);

  return (
    <LyricsContainer id="lyrics">
      <LyricsBanner>lyrics</LyricsBanner>
      <LyricsHeading>{title}</LyricsHeading>
      <LyricWrapper className="lyric-wrapper" dangerouslySetInnerHTML={{ __html: markup }} />
    </LyricsContainer>
  );
}

Lyrics.propTypes = {
  title: string,
  lyrics: string,
};

Lyrics.defaultProps = {
  title: '',
  lyrics: '',
};

export default Lyrics;
