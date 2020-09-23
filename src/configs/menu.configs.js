// import React from 'react';

export const loginRedirectDefault = '/admin';

// admin
export const adminMenu = [{
    text: 'Program Maker',
    path: '/admin/program-maker',
    component: 'ProgramMaker',
    permissions: ['calling:Ward_Clerk']
}, {
    text: 'Attendance',
    path: '/admin/attendance',
    component: 'Attendance',
    permissions: ['org:Bishopric']
}, {
    text: 'Members',
    path: '/admin/members',
    component: 'Members',
    permissions: ['calling:Ward_Clerk']
}, {
    text: 'Main Site',
    path: '/',
    type: 'external' // default is a nav link
}];
