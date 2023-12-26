import {
    defaultMetrics,
    metricForActiveDevice,
    metricForPassiveWithMultipleBreaker,
    metricForPassiveWithOneBreaker,
} from './constants';

export const renderEquipChartMetrics = (equipObj) => {
    const { device_type, breaker_link = [] } = equipObj || {};

    if (device_type === 'active') {
        return metricForActiveDevice;
    }

    if (device_type === '') {
        return metricForPassiveWithOneBreaker;
    }

    if (device_type === 'passive') {
        return (breaker_link?.length || 0) <= 1 ? metricForPassiveWithOneBreaker : metricForPassiveWithMultipleBreaker;
    }

    return defaultMetrics;
};
