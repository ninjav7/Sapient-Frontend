import { Store } from 'pullstate';

// When Building Time Zone not found it will consider 'US/Eastern' as default time zone
const getDefaultTimeZone = 'US/Eastern';

export const BuildingStore = new Store({
    BldgId: localStorage.getItem('buildingId') || '',
    BldgName: localStorage.getItem('buildingName') || '',
    BldgTimeZone: localStorage.getItem('buildingTimeZone') || getDefaultTimeZone,
});

export const BuildingListStore = new Store({
    fetchBuildingList: false,
});
