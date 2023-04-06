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

export const validateBreakerConfiguration = (sourceBreakerObj, targetBreakerObj) => {
    let isGroupable = true;
    let alertText = '';
    if (sourceBreakerObj?.type === 'equipment' && targetBreakerObj?.type === 'equipment') {
        const { isLinkable } = validateDevicesForBreaker([
            sourceBreakerObj?.device_link,
            targetBreakerObj?.device_link,
        ]);

        const isEquipDiff = validateConfiguredEquip(sourceBreakerObj, targetBreakerObj);

        if (!isLinkable) {
            isGroupable = false;
            alertText = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they have different device attached.`;
        }
        if (isEquipDiff) {
            isGroupable = false;
            alertText = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they have different equipment attached.`;
        }

        if (isEquipDiff && !isLinkable) {
            isGroupable = false;
            alertText = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they have different device and equipment attached.`;
        }
    }
    return { isGroupable, alertText };
};

export const toFindDuplicates = (arry) => {
    const uniqueElements = new Set(arry);
    const filteredElements = arry.filter((item) => {
        if (uniqueElements.has(item)) {
            uniqueElements.delete(item);
        } else {
            return item;
        }
    });

    return [...new Set(filteredElements)];
};
