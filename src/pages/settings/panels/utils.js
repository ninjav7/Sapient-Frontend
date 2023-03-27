import { Breaker } from '../../../sharedComponents/breaker';

export const validateConfiguredEquip = (sourceBreakerObj, targetBreakerObj) => {
    let diff = false;
    if (sourceBreakerObj?.equipment_link[0] && targetBreakerObj?.equipment_link[0]) {
        if (sourceBreakerObj?.equipment_link[0] !== targetBreakerObj?.equipment_link[0]) {
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

    if (breakerOne?.equipment_link.length === 0 && breakerTwo?.equipment_link.length === 0) {
        equipmentId = '';
    }
    if (breakerOne?.equipment_link.length === 0 && breakerTwo?.equipment_link.length === 1) {
        equipmentId = breakerTwo?.equipment_link[0];
    }
    if (breakerOne?.equipment_link.length === 1 && breakerTwo?.equipment_link.length === 0) {
        equipmentId = breakerOne?.equipment_link[0];
    }

    return equipmentId;
};

export const validateDevicesForBreaker = (deviceList) => {
    let isLinkable = false;

    const uniqueList = Array.from(new Set(deviceList));

    if (uniqueList.length === 1) isLinkable = true;
    if (uniqueList.length === 2) {
        isLinkable = uniqueList.includes('');
    }
    if (uniqueList.length > 2) isLinkable = false;

    return { isLinkable, uniqueList };
};

export const comparePanelData = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const compareSensorsCount = (inputTxt) => {
    if (inputTxt) {
        let sensors = inputTxt.split('/');
        return sensors[0] === sensors[1];
    }
};

export const getVoltageConfigValue = (value, breakerType) => {
    if (breakerType === 'single') {
        if (value === '120/240') return 120;
        if (value === '208/120') return 120;
        if (value === '480') return 277;
        if (value === '600') return 347;
    }
    if (breakerType === 'double') {
        if (value === '120/240') return 240;
        if (value === '208/120') return 208;
        if (value === '480') return 480;
    }
    if (breakerType === 'triple') {
        if (value === '208/120') return 208;
        if (value === '480') return 480;
        if (value === '600') return 600;
    }
};

export const getPhaseConfigValue = (value, breakerType) => {
    if (breakerType === 'single') {
        if (value === '120/240') return 1;
        if (value === '208/120') return 1;
        if (value === '480') return 1;
        if (value === '600') return 1;
    }

    if (breakerType === 'double') {
        if (value === '120/240') return 1;
        if (value === '208/120') return 1;
        if (value === '480') return 1;
    }

    if (breakerType === 'triple') {
        if (value === '208/120') return 3;
        if (value === '480') return 3;
        if (value === '600') return 3;
    }
};

export const getBreakerType = (breaker_lvl) => {
    if (breaker_lvl === 1) return 'single';
    if (breaker_lvl === 2) return 'double';
    if (breaker_lvl === 3) return 'triple';
};

export const validateBreakerTypeForGrouping = (breakersList, groupType) => {
    if (groupType === 'triple') {
        const [breakerOne, breakerTwo, breakerThree] = breakersList;

        // When all breakers type are same
        if (breakerOne?.type === breakerTwo?.type && breakerOne?.type === breakerThree?.type) {
            if (breakerOne?.type !== 'equipment') return true;
            if (
                breakerOne?.type === 'equipment' &&
                breakerOne?.breaker_state === Breaker.Type.notConfigured &&
                breakerTwo?.breaker_state === Breaker.Type.notConfigured &&
                breakerThree?.breaker_state === Breaker.Type.notConfigured
            ) {
                return true;
            } else {
                return false;
            }
        }
        // If all breaker type are not same
        else {
            const newList = [breakerOne?.type, breakerTwo?.type, breakerThree?.type];
            const fetchBreakerTypes = [...new Set(newList.map(JSON.stringify))].map(JSON.parse);

            // With multiple types get included, one type must be equipment
            if (fetchBreakerTypes.length === 2 && fetchBreakerTypes.includes('equipment')) {
                // Check for equipment type breaker with partially & confgiured state
                // Check 1
                if (breakerOne?.type === 'equipment' && breakerOne?.breaker_state !== Breaker.Type.notConfigured) {
                    return false;
                }
                // Check 2
                if (breakerTwo?.type === 'equipment' && breakerTwo?.breaker_state !== Breaker.Type.notConfigured) {
                    return false;
                }
                // Check 3
                if (breakerThree?.type === 'equipment' && breakerThree?.breaker_state !== Breaker.Type.notConfigured) {
                    return false;
                }
                // Equipment type with not-confgiured state
                return true;
            } else {
                // When with multiple breaker type involved, equipment does not exist
                return false;
            }
        }
    }

    if (groupType === 'double') {
        const [breakerOne, breakerTwo] = breakersList;

        // When all breakers type are same
        if (breakerOne?.type === breakerTwo?.type) {
            if (breakerOne?.type !== 'equipment') return true;
            if (
                breakerOne?.type === 'equipment' &&
                breakerOne?.breaker_state === Breaker.Type.notConfigured &&
                breakerTwo?.breaker_state === Breaker.Type.notConfigured
            ) {
                return true;
            } else {
                return false;
            }
        }
        // If all breaker type are not same
        else {
            if (breakerOne?.type === 'equipment' || breakerTwo?.type === 'equipment') {
                // Check for equipment type breaker with partially & confgiured state
                // Check 1
                if (breakerOne?.type === 'equipment' && breakerOne?.breaker_state !== Breaker.Type.notConfigured) {
                    return false;
                }
                // Check 2
                if (breakerTwo?.type === 'equipment' && breakerTwo?.breaker_state !== Breaker.Type.notConfigured) {
                    return false;
                }
                // When with multiple breaker type as equipment, with not-configured state
                return true;
            } else {
                // When both breaker types are different and not any one is of type equipment
                return false;
            }
        }
    }
};
