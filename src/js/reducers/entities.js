import { combineReducers } from 'redux';

import { programEntities } from '../containers/program/programEntities';
import { announcementEntities } from '../containers/announcements/announcementsEntities';

export default combineReducers({
    program: programEntities,
    announcements: announcementEntities
});
