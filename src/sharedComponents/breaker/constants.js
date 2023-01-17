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

export { BREAKER_STATUSES, BREAKER_TYPES, BREAKER_CALLBACKS };
