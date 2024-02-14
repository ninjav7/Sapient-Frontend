export const TARGET_TYPES = Object.freeze({
    BUILDING: 'building',
    EQUIPMENT: 'equipment',
});

export const defaultConditionObj = {
    condition_metric: '',
    condition_metric_aggregate: 'sum',
    condition_timespan: 'month',
    condition_operator: 'above',
    condition_threshold_type: 'static_threshold_value',
    condition_threshold_value: '',
    condition_threshold_reference: '',
    condition_threshold_calculated: '',
    condition_threshold_timespan: '',
    condition_trigger_alert: '',
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
    },
    notification: {
        ...defaultNotificationObj,
        submitted: false,
    },
};

// Building Alert Conditions
export const bldgAlertConditions = [
    {
        label: 'Energy consumption',
        value: 'energy_consumption',
    },
    {
        label: 'Peak demand',
        value: 'peak_demand',
    },
    {
        label: 'Carbon',
        value: 'carbon',
    },
];

// Equipment Alert Conditions
export const equipAlertConditions = [
    {
        label: 'Energy consumption is',
        value: 'energy_consumption',
    },
    {
        label: 'Power is',
        value: 'power',
    },
    {
        label: 'RMS Current is',
        value: 'sensor_rms_current',
    },
    {
        label: 'Min Current is',
        value: 'sensor_min_current',
    },
    {
        label: 'Max Current is',
        value: 'sensor_max_current',
    },
    {
        label: 'Average Equipment Current is',
        value: 'average_equipment_current',
    },
    {
        label: 'Phase Imbalance Current is',
        value: 'phase_imbalance_current',
    },
    {
        label: 'Phase Imbalance Percent is',
        value: 'phase_imbalance_percent',
    },
    {
        label: 'Runtime',
        value: 'runtime',
    },
    {
        label: 'Starts',
        value: 'starts',
    },
    {
        label: 'Stops',
        value: 'stops',
    },
];

export const aggregationList = [
    {
        label: 'Sum',
        value: 'sum',
    },
    {
        label: 'Average',
        value: 'average',
    },
];

export const timespanList = [
    {
        label: 'Year',
        value: 'year',
    },
    {
        label: 'Month',
        value: 'month',
    },
    {
        label: 'Week',
        value: 'week',
    },
    {
        label: 'Day',
        value: 'day',
    },
    {
        label: 'Hour',
        value: 'hour',
    },
];

export const timeIntervalsList = [
    {
        label: 'Month',
        value: 'month',
    },
];

export const operatorsList = [
    {
        label: 'Above',
        value: 'above',
    },
    {
        label: 'Below',
        value: 'below',
    },
    {
        label: 'Equal',
        value: 'equal',
    },
];

export const thresholdTypeList = [
    {
        label: 'Static Threshold Value',
        value: 'static_threshold_value',
    },
    {
        label: 'Calculated',
        value: 'calculated',
    },
    // Commented for Alert V1 release
    // {
    //     label: 'Reference',
    //     value: 'reference',
    // },
];

export const thresholdReferenceList = [
    {
        label: 'RLA',
        value: 'rla',
    },
    {
        label: 'FLA',
        value: 'fla',
    },
];

export const thresholdConditionTimespanList = [
    {
        label: 'Previous Month',
        value: 'previous_month',
        operationType: 'sum',
        timespan: 'month',
    },
    {
        label: 'Same Month of Previous Year',
        value: 'same_month_previous_year',
        operationType: 'sum',
        timespan: 'month',
    },
    {
        label: 'Previous Year',
        value: 'previous_year',
        operationType: 'sum',
        timespan: 'year',
    },
    {
        label: 'Previous Week',
        value: 'previous_week',
        operationType: 'sum',
        timespan: 'week',
    },
    {
        label: 'Same Week of Previous Month',
        value: 'same_week_previous_month',
        operationType: 'sum',
        timespan: 'week',
    },
    {
        label: 'Same Week of Previous Year',
        value: 'same_week_previous_year',
        operationType: 'sum',
        timespan: 'week',
    },
    {
        label: 'Previous Day',
        value: 'previous_day',
        operationType: 'sum',
        timespan: 'day',
    },
    {
        label: 'Same Day of Previous Week',
        value: 'same_day_previous_week',
        operationType: 'sum',
        timespan: 'day',
    },
    {
        label: 'Same Date of Previous Month',
        value: 'same_date_previous_month',
        operationType: 'sum',
        timespan: 'day',
    },
    {
        label: 'Previous Hour',
        value: 'previous_hour',
        operationType: 'sum',
        timespan: 'hour',
    },
    {
        label: 'Same Hour of Previous Day',
        value: 'same_hour_previous_day',
        operationType: 'sum',
        timespan: 'hour',
    },
    {
        label: 'Same Hour of Previous Week',
        value: 'same_hour_previous_week',
        operationType: 'sum',
        timespan: 'hour',
    },
    {
        label: 'Previous Year Monthly',
        value: 'previous_year_monthly',
        operationType: 'average',
        timespan: 'month',
    },
    {
        label: 'Previous Year',
        value: 'previous_year',
        operationType: 'average',
        timespan: 'year',
    },
    {
        label: 'Previous Month Weekly',
        value: 'previous_month_weekly',
        operationType: 'average',
        timespan: 'week',
    },
    {
        label: 'Previous Year of same Month Weekly',
        value: 'previous_year_same_month_weekly',
        operationType: 'average',
        timespan: 'week',
    },
    {
        label: 'Previous Week Daily',
        value: 'previous_week_daily',
        operationType: 'average',
        timespan: 'day',
    },
    {
        label: 'Previous Month Daily',
        value: 'previous_month_daily',
        operationType: 'average',
        timespan: 'day',
    },
    {
        label: 'Previous Year of same Week Daily',
        value: 'previous_year_same_week_daily',
        operationType: 'average',
        timespan: 'day',
    },
    {
        label: 'Previous Year of same Month Daily',
        value: 'previous_year_same_month_daily',
        operationType: 'average',
        timespan: 'day',
    },
    {
        label: 'Previous Day Hourly',
        value: 'previous_day_hourly',
        operationType: 'average',
        timespan: 'hour',
    },
    {
        label: 'Previous Week of same Day Hourly',
        value: 'previous_week_same_day_hourly',
        operationType: 'average',
        timespan: 'hour',
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
