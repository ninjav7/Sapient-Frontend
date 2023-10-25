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
    alertType: '',
    typesList: [],
    lists: [],
    conditions: {
        type: '',
        level: 'above',
        target_value: '',
    },
};
export const conditionLevelsList = [
    {
        label: 'above',
        value: 'above',
    },
    {
        label: 'below',
        value: 'below',
    },
];
