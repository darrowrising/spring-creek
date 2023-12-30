#!/bin/bun
/* eslint-disable import/extensions */
import { db } from './firebase.js';
// import { catchify } from '../src/utils/data.utils.js';

const getEvents = () => {
  db.collection('announcements')
    .get()
    .then((snap) => {
      console.log('snap:', snap);
    })
    .catch((err) => console.log('error:', err));
};

getEvents();
