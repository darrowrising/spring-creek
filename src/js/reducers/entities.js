import { combineReducers } from 'redux';

import { programEntities } from '../containers/program/programEntities';
import { announcementEntities } from '../containers/announcements/announcementsEntities';
import { moderateEntities } from '../containers/moderate/moderateEntities';
import { special_entity } from '../components/special/special_entity';
import { singleEventEntities } from '../containers/singleEvent/singleEvent.entities';

export default combineReducers({
    program: programEntities,
    announcements: announcementEntities,
    moderate: moderateEntities,
    special: special_entity,
    singleEvent: singleEventEntities,
});
