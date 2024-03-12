import { Store } from 'pullstate';

export const ExploreStore = new Store({
    selectedFilter: localStorage.getItem('selectedFilter') ?? `no-grouping`,
});
