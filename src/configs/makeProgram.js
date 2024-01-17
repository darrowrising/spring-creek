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
  printLayout: 'classes',
  coverImage: '',
  presiding: 'Bishop Jake York',
  conducting: 'Bishop Jake York',
  chorister: 'Libby Anderson',
  organist: 'Vaughn Kinghorn',
  opening_hymn: 14,
  invocation: 'Taylor Norseth',
  sacrament_hymn: 171,
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
      value: 'Ayla Kadri',
      priority: 0,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Isaac York',
      priority: 1,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Erin Dangerfield',
      priority: 2,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Garrett Clegg',
      priority: 3,
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
  closing_hymn: 142,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Missy Fox',
  lyrics: {
    title: '',
    words: '',
  },
};
