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
 */
export const programConfig = {
  printLayout: 'events',
  coverImage: '',
  presiding: 'Bishop Jake York',
  conducting: 'Jonny Anderson',
  chorister: 'Gage Lichfield',
  organist: 'Vaughn Kinghorn',
  opening_hymn: 3,
  invocation: 'Laura York',
  sacrament_hymn: 180,
  topic: 'Joseph Smith, Christ-centered Lives',
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
      value: 'Bryan Carroll',
      priority: 0,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Lyndsey Grimm',
      priority: 1,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Julie Monroe',
      priority: 2,
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
  closing_hymn: 239,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Josh Dyreng',
  lyrics: {
    title: '',
    words: '',
  },
};
