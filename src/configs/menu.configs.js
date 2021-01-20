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
        text: 'Attendance',
        path: '/admin/attendance',
        component: 'Attendance',
        permissions: ['org:Bishopric', 'org:Ward_Council', 'org:Relief_Society_Presidency'],
    },
    {
        text: 'Members',
        path: '/admin/members',
        component: 'Members',
        permissions: ['calling:Ward_Clerk'],
    },
    {
        text: 'Questions List',
        path: '/admin/questions',
        component: 'Questions',
        permissions: ['org:Bishopric'],
    },
    {
        text: 'Main Site',
        path: '/',
        type: 'external', // default is a nav link
    },
];
