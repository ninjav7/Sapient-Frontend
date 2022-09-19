export const formatConsumptionValue = (value, fixed) =>
    value.toLocaleString(undefined, { maximumFractionDigits: fixed });
