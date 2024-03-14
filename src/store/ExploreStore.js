import { Store } from 'pullstate';
import { EXPLORE_FILTER_TYPE } from '../pages/explore/constants';

export const ExploreStore = new Store({
    selectedFilter: localStorage.getItem('selectedFilter') ?? EXPLORE_FILTER_TYPE.NO_GROUPING,
});
