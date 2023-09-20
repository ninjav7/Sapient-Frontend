export const UTILITY_MONITOR = {
    PULSE_COUNTER: 'pulse counter',
    SHADOW_METER: 'shadow meter',
};

export const utilityMeterModel = [
    {
        value: UTILITY_MONITOR.PULSE_COUNTER,
        label: 'Sapient Pulse',
    },
    {
        value: 'shadow_50',
        label: 'Sapient Shadow 50',
    },
    {
        value: 'shadow_100',
        label: 'Sapient Shadow 100',
    },
    {
        value: 'shadow_250',
        label: 'Sapient Shadow 250',
    },
];

export const shadowChartMetrics = [
    { value: 'energy', label: 'Energy (Wh)', unit: 'Wh', Consumption: 'Energy' },
    { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    { value: 'current', label: 'Current (mA)', unit: 'mA', Consumption: 'Current' },
    { value: 'voltage', label: 'Voltage (mV)', unit: 'mV', Consumption: 'Voltage' },
    { value: 'apparent_power', label: 'Apparent Power (VA)', unit: 'VA', Consumption: 'Apparent Power' },
    { value: 'reactive_power', label: 'Reactive Power (VAR)', unit: 'VAR', Consumption: 'Reactive Power' },
    { value: 'frequency', label: 'Frequency (Hz)', unit: 'Hz', Consumption: 'Frequency' },
    { value: 'power_factor', label: 'Power Factor', unit: '', Consumption: 'Power Factor' },
];

export const pulseChartMetrics = [
    { value: 'energy', label: 'Energy (Wh)', unit: 'Wh', Consumption: 'Energy' },
    { value: 'pulse count', label: 'Pulse Count', unit: '', Consumption: 'Pulse Count' },
    { value: 'total pulses', label: 'Total Pulses', unit: '', Consumption: 'Total Pulses' },
];

// Convert to Alpha Numeric
export const convertToAlphaNumeric = (input) => {
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, '');
    return sanitizedInput;
};

export const convertToMac = (deviceSearch) => {
    let mac = deviceSearch;
    if (!deviceSearch.includes(':')) mac = deviceSearch.match(/.{1,2}/g).join(':');
    return mac;
};
