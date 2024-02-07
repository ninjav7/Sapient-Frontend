import {
    defaultMetrics,
    metricForActiveDevice,
    metricForActiveDeviceOld,
    metricForPassiveWithMultipleBreaker,
    metricForPassiveWithOneBreaker,
} from './constants';

export const renderEquipChartMetrics = (equipObj) => {
    const { device_type, breaker_link = [] } = equipObj || {};

    if (device_type === 'active') {
        return metricForActiveDeviceOld;
    }

    if (device_type === '') {
        return metricForPassiveWithOneBreaker;
    }

    if (device_type === 'passive') {
        return (breaker_link?.length || 0) <= 1 ? metricForPassiveWithOneBreaker : metricForPassiveWithMultipleBreaker;
    }

    return defaultMetrics;
};

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
