import React from 'react';
import { string } from 'prop-types';

import './lyrics.less';

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
    <div id="lyrics">
      <div className="lyric-banner">lyrics</div>
      <h3 className="lyric-heading">{title}</h3>
      <div className="lyric-wrapper" dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
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
