export const defaultMetrics = [
    { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
    { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    { value: 'rmsCurrentMilliAmps', label: 'Current (A)', unit: 'A', Consumption: 'Current' },
];

export const metricForActiveDevice = [
    { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
    { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    { value: 'current', label: 'Current (A)', unit: 'A', Consumption: 'Current' },
    { value: 'voltage', label: 'Voltage (V)', unit: 'V', Consumption: 'Voltage' },
    { value: 'runtime', label: 'Runtime', unit: 'minutes', Consumption: 'Runtime' },
    { value: 'starts', label: 'Starts', unit: '', Consumption: 'Starts' },
];

export const metricForPassiveWithOneBreaker = [
    { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
    { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    { value: 'avg_current', label: 'Average Current (A)', unit: 'A', Consumption: 'Current' },
    { value: 'sensor_rms_current', label: 'Sensor RMS Current (A)', unit: 'A', Consumption: 'Sensor RMS Current' },
    { value: 'sensor_max_current', label: 'Sensor Max Current (A)', unit: 'A', Consumption: 'Sensor Max Current' },
    { value: 'sensor_min_current', label: 'Sensor Min Current (A)', unit: 'A', Consumption: 'Sensor Min Current' },
    { value: 'runtime', label: 'Runtime', unit: 'minutes', Consumption: 'Runtime' },
    { value: 'starts', label: 'Starts', unit: '', Consumption: 'Starts' },
];

export const metricForPassiveWithMultipleBreaker = [
    ...metricForPassiveWithOneBreaker,
    {
        value: 'phase_imbalance_current',
        label: 'Phase Imbalance Current (A)',
        unit: 'A',
        Consumption: 'Phase Imbalance Current',
    },
    {
        value: 'phase_imbalance_percent',
        label: 'Phase Imbalance Percent (%)',
        unit: '%',
        Consumption: 'Phase Imbalance Percent',
    },
    {
        value: 'max_phase_imbalance_current',
        label: 'Max Phase Imbalance Current (A)',
        unit: 'A',
        Consumption: 'Max Phase Imbalance Current',
    },
    {
        value: 'min_phase_imbalance_current',
        label: 'Min Phase Imbalance Current (A)',
        unit: 'A',
        Consumption: 'Min Phase Imbalance Current',
    },
    {
        value: 'max_phase_imbalance_percent',
        label: 'Max Phase Imbalance Percent (%)',
        unit: '%',
        Consumption: 'Max Phase Imbalance Percent',
    },
    {
        value: 'min_phase_imbalance_percent',
        label: 'Min Phase Imbalance Percent (%)',
        unit: '%',
        Consumption: 'Min Phase Imbalance Percent',
    },
];
