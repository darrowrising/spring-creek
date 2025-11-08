/* options
 * path
 * text
 * authenticate - if yes, all authenticated users will see
 * permission - does user have permission to view
 * expire - date the link will no longer show in the nav - format: M/D/YY
 */
export const headerNav = [
  {
    path: '/',
    text: 'Home',
    key: 0,
  },
  {
    path: '/program',
    text: 'Sacrament Program',
    key: 1,
  },
  {
    path: '/announcements',
    text: 'Announcements',
    key: 2,
  },
  {
    path: '/temple-family-history-initiative',
    text: '2024 Initiative',
    expire: '3/19/24',
    key: 3,
  },
  {
    path: '/admin',
    text: 'Admin',
    authenticate: true,
    key: 99,
  },
];

export const adminMenu = ({ members, moderation }) => [
  {
    label: 'build program',
    path: 'build-program',
    permissions: ['calling:ward_clerk'],
  },
  {
    label: 'conducting',
    permissions: ['org:bishopric', 'calling:ward_clerk'],
  },
  {
    label: 'hymns',
    permissions: ['calling:ward_clerk'],
  },
  {
    label: 'members',
    count: members,
    permissions: ['org:bishopric', 'calling:ward_clerk'],
  },
  {
    label: 'migrations',
    permissions: [],
  },
  {
    label: 'moderation',
    count: moderation,
    permissions: ['org:bishopric'],
  },
  {
    label: 'sacrament prayers',
    path: 'sacrament-prayers',
    permissions: ['org:bishopric', 'calling:ward_clerk', 'page:prayers'],
  },
  {
    label: 'sacrament speakers',
    path: 'sacrament-speakers',
    permissions: ['org:bishopric', 'calling:ward_clerk', 'page:sacrament-speakers'],
  },
];
