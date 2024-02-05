export const TARGET_TYPES = Object.freeze({
    BUILDING: 'building',
    EQUIPMENT: 'equipment',
});

export const defaultConditionObj = {
    type: '',
    level: 'above',
    filterType: 'number',
    thresholdValue: '',
    threshold50: true,
    threshold75: true,
    threshold90: true,
    thresholdName: '',
    shortcyclingMinutes: '0',
    thresholdPercentage: '0',
};

export const defaultRecurrenceObj = {
    triggerAlert: false,
    triggerAt: '0',
    resendAlert: false,
    resendAt: '0',
};

export const defaultNotificationObj = {
    method: ['none'],
    selectedUserId: [],
    selectedUserEmailId: '',
};

// Main Alert Obj
export const defaultAlertObj = {
    alert_name: '',
    alert_description: '',
    target: {
        type: '',
        lists: [],
        buildingIDs: '',
    },
    recurrence: defaultRecurrenceObj,
    condition: {
        ...defaultConditionObj,
        submitted: false,
    },
    notification: {
        ...defaultNotificationObj,
        submitted: false,
    },
};

// Building Alert Conditions
export const bldgAlertConditions = [
    {
        label: 'Energy consumption for the month is',
        value: 'energy_consumption_month',
    },
    {
        label: 'Peak demand for the month is',
        value: 'peak_demand_month',
    },
];

// Equipment Alert Conditions
export const equipAlertConditions = [
    {
        label: 'RMS Current is',
        value: 'rms_current',
    },
    {
        label: 'Min Current is',
        value: 'min_current',
    },
    {
        label: 'Max Current is',
        value: 'max_current',
    },
    {
        label: 'Peak Power is',
        value: 'peak_power',
    },
    {
        label: 'Average Power is',
        value: 'average_power',
    },
    {
        label: 'Energy consumption is',
        value: 'energy_consumption',
    },
    {
        label: 'Phase Imbalance',
        value: 'phase_imbalance',
    },
    {
        label: 'Shortcycling',
        value: 'shortcycling',
    },
];

export const conditionLevelsList = [
    {
        label: 'Above',
        value: 'above',
    },
    {
        label: 'Below',
        value: 'below',
    },
];

export const filtersForEnergyConsumption = [
    {
        label: 'Number',
        value: 'number',
    },
    {
        label: 'Previous Month',
        value: 'previous_month',
    },
    {
        label: 'Previous Year',
        value: 'previous_year',
    },
];

export const filtersForPeakDemand = [
    {
        label: 'Number',
        value: 'number',
    },
    {
        label: 'Previous Month',
        value: 'previous_month',
    },
    {
        label: 'Past 12 month',
        value: 'previous_year',
    },
];
