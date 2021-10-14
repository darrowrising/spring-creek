// redirects
export const loginRedirectDefault = '/admin';
// widths
export const mobileWidthMax = 708;

// admin
export const adminMenu = [
    {
        text: 'Program Maker',
        path: '/admin/program-maker',
        component: 'ProgramMaker',
        permissions: ['calling:Ward_Clerk'],
    },
    {
        text: 'Sacrament Speakers',
        path: '/admin/sacrament-speakers',
        component: 'Speakers',
        permissions: ['org:Bishopric'],
    },
    {
        text: 'Attendance',
        path: '/admin/attendance',
        component: 'Attendance',
        permissions: ['calling:Ward_Clerk'],
    },
    {
        text: 'Members',
        path: '/admin/members',
        component: 'Members',
        permissions: ['calling:Ward_Clerk'],
        notification: 'newMembers',
    },
    {
        text: 'Questions List',
        path: '/admin/questions',
        component: 'Questions',
        permissions: ['org:Bishopric'],
    },
    {
        text: 'Youth Conference',
        path: '/admin/youth-conference',
        component: 'YouthConference',
        permissions: ['org:Bishopric'],
    },
    {
        text: 'Main Site',
        path: '/',
        type: 'external', // default is a nav link
    },
];
