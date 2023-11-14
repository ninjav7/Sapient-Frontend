export const defaultConditionObj = {
    type: '',
    level: 'above',
    filterType: 'number',
    thresholdValue: '',
    threshold50: false,
    threshold75: false,
    threshold90: false,
};

export const defaultNotificationObj = {
    method: ['none'],
    selectedUserId: [],
    selectedUserEmailId: '',
    sendImmediate: true,
    sendAt: '',
    resendAlert: false,
    resentAt: '',
};

// Main Alert Obj
export const defaultAlertObj = {
    target: {
        type: '',
        typesList: [], // building_type, equipment_type
        lists: [], // buildings_list, equipments_list
        buildingIDs: [],
        submitted: false,
    },
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
        value: 'energy_consumption',
    },
    {
        label: 'Peak demand for the month is',
        value: 'peak_demand',
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
        value: 'past_12_month',
    },
];
