import { Store } from 'pullstate';

export const BuildingStore = new Store({
    BldgId: localStorage.getItem('buildingId'),
    BldgName: localStorage.getItem('buildingName'),
    BldgTimeZone:
        localStorage.getItem('buildingTimeZone') === 'undefined'
            ? 'US/Eastern'
            : localStorage.getItem('buildingTimeZone'),
    BldgName: localStorage.getItem('buildingName'),
    isPlugOnly: localStorage.getItem('isPlugOnly'),
});

export const BuildingListStore = new Store({
    fetchBuildingList: false,
});
