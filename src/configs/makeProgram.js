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
  conducting: 'Bishop Jake York',
  chorister: 'Brock Fox',
  organist: 'Vaughn Kinghorn',
  opening_hymn: 19,
  invocation: 'Rob Wiser',
  sacrament_hymn: 174,
  topic: '',
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
      value: 'Sophie Clegg',
      priority: 0,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Gage Lichfield',
      priority: 1,
    },
    {
      type: 'music',
      title: 'Because',
      value: 'Performed by Sadie Wiser (piano).',
      priority: 2,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Mary Stewart',
      priority: 3,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Drew Hancock',
      priority: 4,
    },
    // {
    //   type: 'hymn',
    //   priority: 1,
    //   value: 29,
    // },
    // {
    //   type: 'music',
    //   title: 'Faith',
    //   value: 'Performed by the Primary',
    //   priority: 1,
    // },
  ],
  closing_hymn: 270,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Kristy Whipple',
  lyrics: {
    title: '',
    words: '',
  },
};
