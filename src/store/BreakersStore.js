import { Store } from 'pullstate';

export const BreakersStore = new Store({
    passiveDeviceData: [],
    equipmentData: [],
    distributedBreakersData: [],
    disconnectedBreakersData: [],
    breakerLinkData: [],
    panelData: {},
    isEditable: false,
});
