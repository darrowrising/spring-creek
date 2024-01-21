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
  chorister: 'Taylor Ellis',
  organist: 'Nicholas Whipple',
  opening_hymn: 5,
  invocation: 'Jenn Davidson',
  sacrament_hymn: 177,
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
      value: 'Christie Kinghorn',
      priority: 0,
    },
    {
      type: 'talk',
      title: 'Speaker',
      value: 'Chris Takemori',
      priority: 2,
    },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Erin Dangerfield',
    //   priority: 4,
    // },
    // {
    //   type: 'talk',
    //   title: 'Speaker',
    //   value: 'Garrett Clegg',
    //   priority: 5,
    // },
    {
      type: 'hymn',
      priority: 1,
      value: 29,
    },
    // {
    //   type: 'music',
    //   title: 'Faith',
    //   value: 'Performed by the Primary',
    //   priority: 1,
    // },
  ],
  closing_hymn: 129,
  // closing_hymn: {
  //   title: 'I Will Walk With Jesus',
  //   number: '',
  // },
  // closing_hymn_extra: 'Congregation will join on verse 2 and 3',
  benediction: 'Pete Norseth',
  lyrics: {
    title: '',
    words: '',
  },
};
