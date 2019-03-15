import { combineReducers } from 'redux';

import { programEntities } from '../containers/program/programEntities';
import { announcementEntities } from '../containers/announcements/announcementsEntities';
import { moderateEntities } from '../containers/moderate/moderateEntities';
import { buildingCleaning_entity } from '../components/buildingCleaning/buildingCleaning_entity';

export default combineReducers({
    program: programEntities,
    announcements: announcementEntities,
    moderate: moderateEntities,
    special: buildingCleaning_entity
});
