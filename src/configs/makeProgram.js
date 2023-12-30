/* YYMMDD format */
export const programDate = null;

/* Program Options
 * talk
 * music
 * meeting
 * hymn
 */
/* Hymn Options
 * [number] = reqular hymns
 * csb_[number] = children song book
 */
export const programConfig = {
  printLayout: 'programOnly',
  coverImage: '',
  presiding: 'Bishop Jake York',
  conducting: 'Jonny Anderson',
  chorister: 'Gage Lichfield',
  organist: 'Shawn Petersen',
  opening_hymn: 202,
  invocation: 'Garrett Clegg',
  sacrament_hymn: 192,
  topic: 'Christmas Program',
  program: [
    // {
    //   type: 'meeting',
    //   title: '',
    //   value: 'Bearing of Testimonies',
    //   priority: 0,
    // },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Anna Eastman',
      priority: 0,
    },
    {
      type: 'music',
      title: '"What Child is This?"',
      value: 'Performed by Claire (flute) and Kate Hinchey (harp).',
      priority: 1,
    },
    {
      type: 'music',
      title: '"I\'d Sing you a Song"',
      value: 'Performed by the Young Women. Accompanied by Nicholas Whipple.',
      priority: 2,
    },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Jared Kirby',
      priority: 3,
    },
    {
      type: 'music',
      title: '"Silent Night"',
      value: 'Performed by Ava Rivers (violin), Julie Aamodt (viola), Shawn Petersen (piano).',
      priority: 4,
    },
    {
      type: 'music',
      title: '"In the Bleak Midwinter"',
      value: 'Performed by the Ward Choir. Accompanied by Shawn Petersen.',
      priority: 5,
    },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Anna Eastman',
      priority: 6,
    },
    {
      type: 'music',
      title: '"When We Seek Him"',
      value: 'Performed by the Primary. Accompanied by Shawn Petersen.',
      priority: 7,
    },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Jared Kirby',
      priority: 8,
    },
    {
      type: 'music',
      title: '"Still, Still, Still"',
      value: 'Performed by Leah Baggs.',
      priority: 9,
    },
    {
      type: 'music',
      title: '"The First Noel"',
      value: 'Performed by Maddy Anderson. Accompanied by Nicholas Whipple.',
      priority: 10,
    },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Anna Eastman',
      priority: 11,
    },
    {
      type: 'hymn',
      priority: 12,
      value: 210,
    },
    {
      type: 'talk',
      title: 'Narrator',
      value: 'Jared Kirby',
      priority: 13,
    },
    {
      type: 'music',
      title: '"Oh, Watch the Stars"',
      value: 'Performed by the Ward Choir. Accompanied by Shawn Petersen.',
      priority: 14,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Bishop Jake York',
      priority: 15,
    },
    // {
    //   type: 'hymn',
    //   priority: 3,
    // },
    // {
    //   type: 'music',
    //   title: 'Faith',
    //   value: 'Performed by the Primary',
    //   priority: 1,
    // },
  ],
  closing_hymn: 208,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Kathy Robbins',
  lyrics: {
    title: '',
    words: '',
  },
};
