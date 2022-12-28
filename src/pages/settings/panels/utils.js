import { LoadingStore } from '../../../store/LoadingStore';

export const setProcessing = (value) => {
    LoadingStore.update((s) => {
        s.isLoading = value;
    });
};

export const breakerLinkingAlerts = (numberOne, numberTwo) => {
    alert(`Breaker ${numberOne} & Breaker ${numberTwo} cannot be linked!`);
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

export const comparePanelData = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};
