import { LoadingStore } from '../../../store/LoadingStore';

export const setProcessing = (value) => {
    LoadingStore.update((s) => {
        s.isLoading = value;
    });
};

export const breakerLinkingAlerts = (numberOne, numberTwo) => {
    alert(`Breaker ${numberOne} & Breaker ${numberTwo} cannot be linked!`);
};

export const unableLinkingAlerts = () => {
    alert(`Breaker cannot be linked due to different Device/Equipment configuration!`);
};

export const validateConfiguredEquip = (sourceBreakerObj, targetBreakerObj) => {
    let diff = false;
    if (sourceBreakerObj?.data?.equipment_link[0] && targetBreakerObj?.data?.equipment_link[0]) {
        if (sourceBreakerObj?.data?.equipment_link[0] !== targetBreakerObj?.data?.equipment_link[0]) {
            diff = true;
        }
    } else {
        diff = false;
    }
    return diff;
};

export const panelType = [
    {
        label: 'Distribution',
        value: 'distribution',
    },
    {
        label: 'Disconnect',
        value: 'disconnect',
    },
];

export const disconnectBreaker = [
    {
        label: '1',
        value: '1',
    },
    {
        label: '2',
        value: '2',
    },
    {
        label: '3',
        value: '3',
    },
];

export const voltsOption = [
    { value: '120/240', label: '120/240' },
    { value: '208/120', label: '208/120' },
    { value: '480', label: '480' },
    { value: '600', label: '600' },
];

export const getEquipmentForBreaker = (breakers) => {
    let equipmentId = '';
    const [breakerOne, breakerTwo] = breakers;

    if (breakerOne?.data?.equipment_link.length === 0 && breakerTwo?.data?.equipment_link.length === 0) {
        equipmentId = '';
    }
    if (breakerOne?.data?.equipment_link.length === 0 && breakerTwo?.data?.equipment_link.length === 1) {
        equipmentId = breakerTwo?.data?.equipment_link[0];
    }
    if (breakerOne?.data?.equipment_link.length === 1 && breakerTwo?.data?.equipment_link.length === 0) {
        equipmentId = breakerOne?.data?.equipment_link[0];
    }

    return equipmentId;
};

export const validateDeviceForBreaker = (deviceList) => {
    let isLinkable = false;

    const uniqueList = Array.from(new Set(deviceList));

    if (uniqueList.length === 1) isLinkable = true;
    if (uniqueList.length === 2) {
        isLinkable = uniqueList.includes('');
    }
    if (uniqueList.length > 2) isLinkable = false;

    return isLinkable;
};

export const comparePanelData = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};
