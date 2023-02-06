const BREAKER_STATUSES = Object.freeze({
    online: 'online',
    offline: 'offline',
    noSenors: 'no-sensors',
});

const BREAKER_TYPES = Object.freeze({
    notConfigured: 'not-configured',
    partiallyConfigured: 'partially-configured',
    configured: 'configured',
    offline: 'offline',
});

const BREAKER_CALLBACKS = Object.freeze({
    ON_EDIT: 'onEdit',
    ON_SHOW_CHART_DATA: 'onShowChart',
});

const BREAKER_ITEMS_PROP_MAP = ['id', 'status', 'sensorId', 'deviceId'];

export { BREAKER_STATUSES, BREAKER_TYPES, BREAKER_CALLBACKS, BREAKER_ITEMS_PROP_MAP };
