import { search } from '../../../../utils/search.util';

const searchKeyAllowList = ['email', 'displayName', 'status'];

export const searchList = (list, value) => search(list, value, searchKeyAllowList);
