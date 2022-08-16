import { Store } from 'pullstate';

export const BreakersStore = new Store({
    passiveDeviceData: [],
    equipmentData: [],
    distributedBreakersData: [],
    disconnectedBreakersData: [],
    breakerLinkData: [],
    disconnectBreakerLinkData: [],
    panelData: {},
    isEditable: true,
});
