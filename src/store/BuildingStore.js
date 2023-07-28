import { Store } from 'pullstate';

export const BuildingStore = new Store({
    BldgId: localStorage.getItem('buildingId'),
    BldgName: localStorage.getItem('buildingName'),
    BldgTimeZone:
        localStorage.getItem('buildingTimeZone') === 'undefined'
            ? 'US/Eastern'
            : localStorage.getItem('buildingTimeZone'),
});

export const BuildingListStore = new Store({
    fetchBuildingList: false,
});
