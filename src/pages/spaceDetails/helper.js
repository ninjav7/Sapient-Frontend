export const handleDataConversion = (value, metricType = 'energy') => {
    if (value === '') {
        return null;
    }

    const noConversionRequired = ['runtime', 'starts'];
    const multiplyBy100 = ['phase_imbalance_percent', 'min_phase_imbalance_percent', 'max_phase_imbalance_percent'];

    if (noConversionRequired.includes(metricType)) {
        return value;
    }

    if (multiplyBy100.includes(metricType)) {
        return value * 100;
    }

    return value / 1000;
};
