import { Store } from 'pullstate';

export const ExploreBuildingStore = new Store({
    exploreBldId: localStorage.getItem('exploreBldId'),
    exploreBldName: localStorage.getItem('exploreBldName'),
});
