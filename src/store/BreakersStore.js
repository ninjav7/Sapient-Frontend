import { Store } from 'pullstate';

export const BreakersStore = new Store({
    passiveDeviceData: [],
    totalPassiveDeviceCount: 0,
    equipmentData: [],
    distributedBreakersData: [],
    disconnectedBreakersData: [],
    breakerLinkData: [],
    disconnectBreakerLinkData: [],
    panelData: {},
    isEditable: false,
});
