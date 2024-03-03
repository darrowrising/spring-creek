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
/* printLayout Options
 * events
 * programOnly
 * colorPage
 * classes
 */
export const programConfig = {
  printLayout: 'events',
  coverImage: '',
  presiding: 'Bishop Jake York',
  conducting: 'Steve Hunt',
  chorister: 'Taylor Ellis',
  organist: 'Vaughn Kinghorn',
  opening_hymn: 113,
  invocation: 'Landon Wessman',
  sacrament_hymn: 194,
  topic: 'High Council',
  program: [
    // {
    //   type: 'meeting',
    //   title: '',
    //   value: 'Bearing of Testimonies',
    //   priority: 0,
    // },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Lauren Mackay',
      priority: 0,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Steve Mackay',
      priority: 2,
    },
    {
      type: 'music',
      title: 'I lived in heaven',
      value: 'Performed by Bennett Dangerfield and Clara Petersen. Accompanied by Shawn Petersen (piano).',
      priority: 1,
    },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Missy Fox',
    //   priority: 3,
    // },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Josh Dyreng',
    //   priority: 4,
    // },
    // {
    //   type: 'hymn',
    //   priority: 2,
    //   value: 58,
    // },
    // {
    //   type: 'music',
    //   title: 'Faith',
    //   value: 'Performed by the Primary',
    //   priority: 1,
    // },
  ],
  closing_hymn: 239,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Taryn Lichfield',
  lyrics: {
    title: '',
    words: '',
  },
};
