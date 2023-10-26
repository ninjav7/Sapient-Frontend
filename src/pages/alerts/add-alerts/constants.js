export const alertConditions = [
    {
        label: 'Energy consumption for current month is',
        value: 'energy_consumption',
    },
    {
        label: 'Peak demand for current month is',
        value: 'peak_demand',
    },
];

export const defaultAlertObj = {
    target: {
        type: '',
        typesList: [],
        lists: [],
        submitted: false,
    },
    condition: {
        type: '',
        level: 'above',
        filterType: 'number',
        thresholdValue: '',
        threshold50: false,
        threshold75: false,
        threshold90: false,
        submitted: false,
    },
};

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
