import { Store } from 'pullstate';

export const BuildingStore = new Store({
    BldgId: localStorage.getItem('buildingId'),
    BldgName: localStorage.getItem('buildingName'),
    BldgTimeZone: localStorage.getItem('buildingTimeZone'),
});
